-- Create a helper function to resolve usernames to emails without requiring client-side table access
create or replace function public.resolve_username_email(username text)
returns text
language sql
security definer
set search_path = public
as $$
  select email
  from public.profiles
  where usuario = username
  limit 1;
$$;

grant execute on function public.resolve_username_email(text) to anon, authenticated;
