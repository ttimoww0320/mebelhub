-- Profiles (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text not null,
  phone text,
  role text not null check (role in ('customer', 'craftsman')),
  avatar_url text,
  bio text,
  rating numeric(3,2) default 0,
  reviews_count integer default 0,
  created_at timestamptz default now()
);

-- Orders
create table orders (
  id uuid default gen_random_uuid() primary key,
  customer_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  description text not null,
  furniture_type text not null,
  style text,
  width_cm numeric,
  height_cm numeric,
  depth_cm numeric,
  budget_min numeric,
  budget_max numeric,
  material text,
  color text,
  images text[] default '{}',
  status text not null default 'open' check (status in ('open', 'in_progress', 'completed', 'cancelled')),
  deadline date,
  created_at timestamptz default now()
);

-- Offers from craftsmen
create table offers (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders(id) on delete cascade not null,
  craftsman_id uuid references profiles(id) on delete cascade not null,
  price numeric not null,
  delivery_days integer not null,
  comment text not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz default now(),
  unique(order_id, craftsman_id)
);

-- RLS Policies
alter table profiles enable row level security;
alter table orders enable row level security;
alter table offers enable row level security;

-- Profiles: anyone can read, only owner can update
create policy "Public profiles" on profiles for select using (true);
create policy "Own profile update" on profiles for update using (auth.uid() = id);
create policy "Own profile insert" on profiles for insert with check (auth.uid() = id);

-- Orders: anyone can read open orders, customer manages their own
create policy "Read open orders" on orders for select using (true);
create policy "Customer creates order" on orders for insert with check (auth.uid() = customer_id);
create policy "Customer updates order" on orders for update using (auth.uid() = customer_id);

-- Offers: craftsmen create, all can read
create policy "Read offers" on offers for select using (true);
create policy "Craftsman creates offer" on offers for insert with check (auth.uid() = craftsman_id);
create policy "Craftsman updates offer" on offers for update using (auth.uid() = craftsman_id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', 'User'),
    coalesce(new.raw_user_meta_data->>'role', 'customer')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
