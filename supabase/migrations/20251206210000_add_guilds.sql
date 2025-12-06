-- Create guilds table
create table if not exists guilds (
  id uuid default uuid_generate_v4() primary key,
  name text unique not null,
  description text,
  level int default 1,
  xp int default 0,
  created_by uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create guild_members table
create table if not exists guild_members (
  id uuid default uuid_generate_v4() primary key,
  guild_id uuid references guilds on delete cascade not null,
  user_id uuid references auth.users not null,
  role text default 'member' check (role in ('owner', 'admin', 'member')),
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(guild_id, user_id)
);

-- Enable RLS
alter table guilds enable row level security;
alter table guild_members enable row level security;

-- Policies for Guilds
create policy "Anyone can view guilds" 
  on guilds for select 
  using ( true );

create policy "Authenticated users can create guilds" 
  on guilds for insert 
  with check ( auth.role() = 'authenticated' );

create policy "Owners can update their guild" 
  on guilds for update 
  using ( auth.uid() = created_by );

-- Policies for Members
create policy "Anyone can view guild members" 
  on guild_members for select 
  using ( true );

create policy "Users can join/leave (insert/delete own record)" 
  on guild_members for all 
  using ( auth.uid() = user_id )
  with check ( auth.uid() = user_id );

create policy "Owners can manage members" 
  on guild_members for all 
  using ( 
    exists (
      select 1 from guilds 
      where id = guild_members.guild_id 
      and created_by = auth.uid()
    )
  );

-- Indexes
create index guilds_name_idx on guilds (name);
create index guild_members_user_id_idx on guild_members (user_id);
create index guild_members_guild_id_idx on guild_members (guild_id);
