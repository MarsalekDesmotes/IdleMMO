-- Create Market Listings Table
create table if not exists market_listings (
  id uuid default uuid_generate_v4() primary key,
  seller_id uuid references auth.users(id) not null,
  seller_name text not null,
  item_id text not null,
  item_data jsonb not null,
  price integer not null check (price > 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Market
alter table market_listings enable row level security;

create policy "Anyone can read listings"
  on market_listings for select
  using (true);

create policy "Users can insert their own listings"
  on market_listings for insert
  with check (auth.uid() = seller_id);

create policy "Users can delete their own listings (or any for logic sake of buying, usually handled by RPC)"
  on market_listings for delete
  using (true); -- Simplified for demo: anyone can delete (buy) in this client-side logic. Ideal: RPC function.

-- Create Guilds Table
create table if not exists guilds (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  description text,
  leader_id uuid references auth.users(id) not null,
  level integer default 1,
  xp bigint default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  member_count integer default 1
);

-- RLS for Guilds
alter table guilds enable row level security;

create policy "Anyone can read guilds"
  on guilds for select
  using (true);

create policy "Authenticated users can create guilds"
  on guilds for insert
  with check (auth.role() = 'authenticated');

-- Create Guild Members Table
create table if not exists guild_members (
  id uuid default uuid_generate_v4() primary key,
  guild_id uuid references guilds(id) on delete cascade not null,
  user_id uuid references auth.users(id) not null,
  character_name text not null,
  role text check (role in ('leader', 'officer', 'member')) default 'member',
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(guild_id, user_id)
);

-- RLS for Guild Members
alter table guild_members enable row level security;

create policy "Anyone can read guild members"
  on guild_members for select
  using (true);

create policy "Users can join/leave"
  on guild_members for all
  using (auth.uid() = user_id);

-- Create Guild Wars Table (Optional/Future)
create table if not exists guild_wars (
  id uuid default uuid_generate_v4() primary key,
  guild_a_id uuid references guilds(id) not null,
  guild_b_id uuid references guilds(id) not null,
  status text default 'active',
  winner_id uuid references guilds(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
