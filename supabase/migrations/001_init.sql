-- Create a table for user profiles (game state)
create table profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  game_state jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS) for profiles
alter table profiles enable row level security;

create policy "Users can view their own profile"
  on profiles for select
  using ( auth.uid() = id );

create policy "Users can update their own profile"
  on profiles for update
  using ( auth.uid() = id );

create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

-- Create a table for chat messages
create table chat_messages (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  username text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS for chat_messages
alter table chat_messages enable row level security;

create policy "Anyone can read chat messages"
  on chat_messages for select
  using ( true );

create policy "Authenticated users can insert chat messages"
  on chat_messages for insert
  with check ( auth.role() = 'authenticated' );

-- Enable Realtime for chat_messages
alter publication supabase_realtime add table chat_messages;
