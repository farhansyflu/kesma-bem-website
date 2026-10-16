-- =====================================================================
-- KESMA BEM STDIIS Jember - skema Supabase
-- Jalankan seluruh file ini di Supabase Dashboard > SQL Editor
-- =====================================================================

-- ---------- Admin ----------
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

drop policy if exists "admin dapat membaca dirinya sendiri" on public.admins;
create policy "admin dapat membaca dirinya sendiri"
  on public.admins for select to authenticated
  using (user_id = auth.uid());
-- Tidak ada policy insert/update/delete: admin hanya bisa ditambah lewat SQL Editor.

-- ---------- 1. Barang temuan ----------
create table if not exists public.barang_temuan (
  id uuid primary key default gen_random_uuid(),
  nama text not null check (char_length(nama) between 1 and 100),
  ciri_ciri text not null check (char_length(ciri_ciri) between 1 and 500),
  lokasi_ditemukan text not null check (char_length(lokasi_ditemukan) between 1 and 150),
  tanggal_ditemukan date not null,
  foto_path text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists barang_temuan_tanggal_idx on public.barang_temuan (tanggal_ditemukan desc);

-- ---------- 2. Laporan barang hilang ----------
create table if not exists public.barang_hilang (
  id uuid primary key default gen_random_uuid(),
  nama text not null check (char_length(nama) between 1 and 100),
  ciri_ciri text not null check (char_length(ciri_ciri) between 1 and 500),
  lokasi_terakhir text not null check (char_length(lokasi_terakhir) between 1 and 150),
  tanggal_hilang date not null,
  foto_path text,               -- opsional; jika null, UI memakai gambar alternatif
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists barang_hilang_tanggal_idx on public.barang_hilang (tanggal_hilang desc);

-- ---------- 3. Beasiswa ----------
create table if not exists public.beasiswa (
  id uuid primary key default gen_random_uuid(),
  judul text not null check (char_length(judul) between 1 and 120),
  deskripsi text not null check (char_length(deskripsi) between 1 and 500),
  tanggal_awal date not null,
  tanggal_berakhir date not null,
  url_postingan text not null check (url_postingan ~* '^https?://'),
  foto_path text,               -- opsional: poster beasiswa
  created_at timestamptz not null default now(),
  check (tanggal_berakhir >= tanggal_awal)
);
create index if not exists beasiswa_awal_idx on public.beasiswa (tanggal_awal desc);

-- ---------- Row Level Security ----------
alter table public.barang_temuan enable row level security;
alter table public.barang_hilang enable row level security;
alter table public.beasiswa      enable row level security;

-- Publik hanya boleh MEMBACA data yang aktif. Admin boleh semuanya.
drop policy if exists "publik baca barang temuan aktif" on public.barang_temuan;
create policy "publik baca barang temuan aktif" on public.barang_temuan
  for select to anon, authenticated using (is_active = true or public.is_admin());

drop policy if exists "admin kelola barang temuan" on public.barang_temuan;
create policy "admin kelola barang temuan" on public.barang_temuan
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "publik baca barang hilang aktif" on public.barang_hilang;
create policy "publik baca barang hilang aktif" on public.barang_hilang
  for select to anon, authenticated using (is_active = true or public.is_admin());

drop policy if exists "admin kelola barang hilang" on public.barang_hilang;
create policy "admin kelola barang hilang" on public.barang_hilang
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "publik baca beasiswa" on public.beasiswa;
create policy "publik baca beasiswa" on public.beasiswa
  for select to anon, authenticated using (true);

drop policy if exists "admin kelola beasiswa" on public.beasiswa;
create policy "admin kelola beasiswa" on public.beasiswa
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- Storage (foto) ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('images', 'images', true, 2097152, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update
  set file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "admin upload gambar" on storage.objects;
create policy "admin upload gambar" on storage.objects
  for insert to authenticated with check (bucket_id = 'images' and public.is_admin());

drop policy if exists "admin ubah gambar" on storage.objects;
create policy "admin ubah gambar" on storage.objects
  for update to authenticated using (bucket_id = 'images' and public.is_admin());

drop policy if exists "admin hapus gambar" on storage.objects;
create policy "admin hapus gambar" on storage.objects
  for delete to authenticated using (bucket_id = 'images' and public.is_admin());

-- ---------- Menjadikan akun sebagai admin ----------
-- 1) Buat user di Authentication > Users (email + password).
-- 2) Jalankan (ganti emailnya):
--
--   insert into public.admins (user_id)
--   select id from auth.users where email = 'admin@contoh.com';
