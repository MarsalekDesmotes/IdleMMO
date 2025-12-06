-- Create a table for user profiles (game state)
create table if not exists profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  game_state jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS) for profiles
alter table profiles enable row level security;

drop policy if exists "Users can view their own profile" on profiles;
create policy "Users can view their own profile"
  on profiles for select
  using ( auth.uid() = id );

drop policy if exists "Users can update their own profile" on profiles;
create policy "Users can update their own profile"
  on profiles for update
  using ( auth.uid() = id );

drop policy if exists "Users can insert their own profile" on profiles;
create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

-- Create a table for chat messages
create table if not exists chat_messages (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  username text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS for chat_messages
alter table chat_messages enable row level security;

drop policy if exists "Anyone can read chat messages" on chat_messages;
create policy "Anyone can read chat messages"
  on chat_messages for select
  using ( true );

drop policy if exists "Authenticated users can insert chat messages" on chat_messages;
create policy "Authenticated users can insert chat messages"
  on chat_messages for insert
  with check ( auth.role() = 'authenticated' );

-- Enable Realtime for chat_messages
-- Check if publication exists first or just alter (add table is idempotent if already added? No, it might throw)
-- Simplest way to avoid error on "already in publication" is to ignore it or use a DO block.
-- Just let it fail if it must? No, db push stops on error.
-- "alter publication ... add table" throws if table is already in publication.
-- Workaround: drop from publication then add? Or usage of DO block.

do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'chat_messages') then
    alter publication supabase_realtime add table chat_messages;
  end if;
end $$;
