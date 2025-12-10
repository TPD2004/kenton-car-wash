-- Create bookings table
create table public.bookings (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  vehicle_reg text,
  service_category text,
  service_name text,
  price numeric,
  booking_date date not null,
  start_time text not null, -- Format "HH:00"
  status text default 'confirmed'
);

-- Enable Row Level Security (RLS)
alter table public.bookings enable row level security;

-- Policy: Allow public inserts (anon)
create policy "Allow public inserts"
on public.bookings
for insert
to anon
with check (true);

-- Policy: Allow public select for availability check
create policy "Allow public select"
on public.bookings
for select
to anon
using (true);
