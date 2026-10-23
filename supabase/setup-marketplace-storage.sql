-- Run this once in Supabase Dashboard > SQL Editor.
-- Creates public-read product images with authenticated, per-user uploads.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'marketplace-images',
  'marketplace-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = true,
    file_size_limit = 5242880,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

drop policy if exists "Public can view marketplace product images" on storage.objects;
create policy "Public can view marketplace product images"
on storage.objects for select
to public
using (bucket_id = 'marketplace-images');

drop policy if exists "Students upload own marketplace product images" on storage.objects;
create policy "Students upload own marketplace product images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'marketplace-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Students update own marketplace product images" on storage.objects;
create policy "Students update own marketplace product images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'marketplace-images'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'marketplace-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Students delete own marketplace product images" on storage.objects;
create policy "Students delete own marketplace product images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'marketplace-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);
