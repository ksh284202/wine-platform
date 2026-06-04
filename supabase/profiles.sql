create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role text not null default 'consumer' check (role in ('consumer', 'business', 'admin')),
  business_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role text;
  safe_role text;
  safe_business_name text;
begin
  requested_role := coalesce(new.raw_user_meta_data ->> 'requested_role', 'consumer');
  safe_role := case
    when requested_role = 'business' then 'business'
    else 'consumer'
  end;

  safe_business_name := case
    when safe_role = 'business' then nullif(trim(coalesce(new.raw_user_meta_data ->> 'business_name', '')), '')
    else null
  end;

  insert into public.profiles (id, email, role, business_name)
  values (new.id, new.email, safe_role, safe_business_name)
  on conflict (id) do update
  set
    email = excluded.email,
    role = case
      when public.profiles.role = 'admin' then 'admin'
      else excluded.role
    end,
    business_name = case
      when public.profiles.role = 'admin' then public.profiles.business_name
      else excluded.business_name
    end;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create policy "Users can read their own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "Users can update their own profile except role"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (
  auth.uid() = id
  and role = (select p.role from public.profiles as p where p.id = auth.uid())
);

create policy "Users can insert their own profile"
on public.profiles
for insert
to authenticated
with check (
  auth.uid() = id
  and role in ('consumer', 'business')
);
