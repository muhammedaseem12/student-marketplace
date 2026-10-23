-- Run once in Supabase SQL Editor to enable buyer-to-seller messaging.
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
drop policy if exists "Participants can read marketplace messages" on public.marketplace_messages;
create policy "Participants can read marketplace messages"
on public.marketplace_messages for select to authenticated
using (auth.uid() = sender_id or auth.uid() = receiver_id);

drop policy if exists "Buyers can message sellers" on public.marketplace_messages;
create policy "Buyers can message sellers"
on public.marketplace_messages for insert to authenticated
with check (
  auth.uid() = sender_id
  and sender_id <> receiver_id
  and (
    exists (
      select 1 from public.marketplace_listings l
      where l.id = listing_id and l.seller_id = receiver_id
    )
    or (
      exists (
        select 1 from public.marketplace_listings l
        where l.id = listing_id and l.seller_id = sender_id
      )
      and exists (
        select 1 from public.marketplace_messages prior
        where prior.listing_id = marketplace_messages.listing_id
          and prior.sender_id = receiver_id
          and prior.receiver_id = sender_id
      )
    )
  )
);

drop policy if exists "Receiver can mark messages read" on public.marketplace_messages;
create policy "Receiver can mark messages read"
on public.marketplace_messages for update to authenticated
using (auth.uid() = receiver_id)
with check (auth.uid() = receiver_id);

-- Enable Realtime so a seller who is online receives incoming messages instantly.
do $$
begin
  alter publication supabase_realtime add table public.marketplace_messages;
exception when duplicate_object then null;
when undefined_object then null;
end $$;
