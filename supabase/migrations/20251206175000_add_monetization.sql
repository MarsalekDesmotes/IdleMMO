-- Add monetization columns to profiles table
alter table profiles 
add column if not exists diamonds integer default 0,
add column if not exists is_prime boolean default false,
add column if not exists prime_expires_at timestamp with time zone;

-- Update RLS if needed (already users query their own profile, so standard select/update works)
-- For security, in a real production app we might restrict 'update' on diamonds/prime to server-side only.
-- But for this MVP/P2P client logic, we allow client updates (with the understanding it's insecure).
