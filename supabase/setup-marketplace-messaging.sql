-- Run this entire script in Supabase SQL Editor.
-- Creates secure buyer/seller messaging and fixes INSERT RLS failures.
create table if not exists public.marketplace_messages (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.marketplace_listings(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  receiver_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 3000),
  created_at timestamptz not null default now(),
  read_at timestamptz
);
create index if not exists marketplace_messages_receiver_created_idx
  on public.marketplace_messages(receiver_id, created_at desc);
create index if not exists marketplace_messages_listing_idx
  on public.marketplace_messages(listing_id, created_at);

alter table public.marketplace_messages enable row level security;

-- SECURITY DEFINER avoids RLS self-reference when checking whether a seller
-- is replying to a buyer who already contacted them.
create or replace function public.can_send_marketplace_message(
  p_listing_id uuid, p_sender_id uuid, p_receiver_id uuid
) returns boolean
language sql
security definer
set search_path = public
as $$
  select
    auth.uid() = p_sender_id
    and p_sender_id <> p_receiver_id
    and (
      exists (
        select 1 from public.marketplace_listings l
        where l.id = p_listing_id and l.seller_id = p_receiver_id
      )
      or (
        exists (
          select 1 from public.marketplace_listings l
          where l.id = p_listing_id and l.seller_id = p_sender_id
        )
        and exists (
          select 1 from public.marketplace_messages prior
          where prior.listing_id = p_listing_id
            and prior.sender_id = p_receiver_id
            and prior.receiver_id = p_sender_id
        )
      )
    );
$$;
revoke all on function public.can_send_marketplace_message(uuid, uuid, uuid) from public;
grant execute on function public.can_send_marketplace_message(uuid, uuid, uuid) to authenticated;

drop policy if exists "Participants can read marketplace messages" on public.marketplace_messages;
create policy "Participants can read marketplace messages"
on public.marketplace_messages for select to authenticated
using (auth.uid() = sender_id or auth.uid() = receiver_id);

drop policy if exists "Buyers can message sellers" on public.marketplace_messages;
drop policy if exists "Participants can send marketplace messages" on public.marketplace_messages;
create policy "Participants can send marketplace messages"
on public.marketplace_messages for insert to authenticated
with check (public.can_send_marketplace_message(listing_id, sender_id, receiver_id));

drop policy if exists "Receiver can mark messages read" on public.marketplace_messages;
create policy "Receiver can mark messages read"
on public.marketplace_messages for update to authenticated
using (auth.uid() = receiver_id)
with check (auth.uid() = receiver_id);

do $$
begin
  alter publication supabase_realtime add table public.marketplace_messages;
exception when duplicate_object then null;
when undefined_object then null;
end $$;
