-- AERIS-AI Stage 4 foundation.
-- Stores user-owned, non-clinical application data only.
-- Sensitive household-member health details are intentionally excluded pending
-- an explicit consent, retention, deletion, and privacy design.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text check (display_name is null or char_length(display_name) <= 100),
  locale text not null default 'en' check (char_length(locale) between 2 and 16),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.households (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  household_name text not null check (char_length(household_name) between 1 and 80),
  neighborhood text check (neighborhood is null or char_length(neighborhood) <= 120),
  home_type text not null check (home_type in ('apartment-high-rise', 'apartment-low-rise', 'independent-house', 'dense-cluster')),
  distance_to_major_road_meters integer not null default 100 check (distance_to_major_road_meters between 0 and 10000),
  air_purifiers_count smallint not null default 0 check (air_purifiers_count between 0 and 100),
  cooking_fuel_type text not null default 'lpg' check (cooking_fuel_type in ('lpg', 'induction', 'biomass', 'kerosene')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists households_owner_id_idx on public.households(owner_id);

create table if not exists public.saved_locations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  state text check (state is null or char_length(state) <= 100),
  country text not null default 'India' check (char_length(country) <= 100),
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, owner_id)
);
create index if not exists saved_locations_owner_id_idx on public.saved_locations(owner_id);
create unique index if not exists saved_locations_one_default_per_owner on public.saved_locations(owner_id) where is_default = true;

create table if not exists public.user_preferences (
  owner_id uuid primary key references auth.users(id) on delete cascade,
  default_location_id uuid,
  aqi_standard text not null default 'CPCB-NAQI' check (aqi_standard in ('CPCB-NAQI', 'US-EPA')),
  alert_threshold integer not null default 150 check (alert_threshold between 0 and 500),
  email_alerts boolean not null default false,
  push_alerts boolean not null default false,
  data_source_priority text not null default 'cpcb-first' check (data_source_priority in ('cpcb-first', 'open-meteo-blend')),
  locale text not null default 'en' check (char_length(locale) between 2 and 16),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_preferences_default_location_owner_fk
    foreign key (default_location_id, owner_id)
    references public.saved_locations(id, owner_id)
    on delete set null (default_location_id)
);

create table if not exists public.saved_schedules (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  location_id uuid,
  activity_type text not null check (char_length(activity_type) between 1 and 60),
  planned_for timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint saved_schedules_location_owner_fk
    foreign key (location_id, owner_id)
    references public.saved_locations(id, owner_id)
    on delete set null (location_id)
);
create index if not exists saved_schedules_owner_planned_idx on public.saved_schedules(owner_id, planned_for desc);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
drop trigger if exists households_set_updated_at on public.households;
create trigger households_set_updated_at before update on public.households
  for each row execute function public.set_updated_at();
drop trigger if exists saved_locations_set_updated_at on public.saved_locations;
create trigger saved_locations_set_updated_at before update on public.saved_locations
  for each row execute function public.set_updated_at();
drop trigger if exists user_preferences_set_updated_at on public.user_preferences;
create trigger user_preferences_set_updated_at before update on public.user_preferences
  for each row execute function public.set_updated_at();
drop trigger if exists saved_schedules_set_updated_at on public.saved_schedules;
create trigger saved_schedules_set_updated_at before update on public.saved_schedules
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.households enable row level security;
alter table public.saved_locations enable row level security;
alter table public.user_preferences enable row level security;
alter table public.saved_schedules enable row level security;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles for select to authenticated using (id = (select auth.uid()));
drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles for insert to authenticated with check (id = (select auth.uid()));
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

drop policy if exists households_select_own on public.households;
create policy households_select_own on public.households for select to authenticated using (owner_id = (select auth.uid()));
drop policy if exists households_insert_own on public.households;
create policy households_insert_own on public.households for insert to authenticated with check (owner_id = (select auth.uid()));
drop policy if exists households_update_own on public.households;
create policy households_update_own on public.households for update to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
drop policy if exists households_delete_own on public.households;
create policy households_delete_own on public.households for delete to authenticated using (owner_id = (select auth.uid()));

drop policy if exists saved_locations_select_own on public.saved_locations;
create policy saved_locations_select_own on public.saved_locations for select to authenticated using (owner_id = (select auth.uid()));
drop policy if exists saved_locations_insert_own on public.saved_locations;
create policy saved_locations_insert_own on public.saved_locations for insert to authenticated with check (owner_id = (select auth.uid()));
drop policy if exists saved_locations_update_own on public.saved_locations;
create policy saved_locations_update_own on public.saved_locations for update to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
drop policy if exists saved_locations_delete_own on public.saved_locations;
create policy saved_locations_delete_own on public.saved_locations for delete to authenticated using (owner_id = (select auth.uid()));

drop policy if exists user_preferences_select_own on public.user_preferences;
create policy user_preferences_select_own on public.user_preferences for select to authenticated using (owner_id = (select auth.uid()));
drop policy if exists user_preferences_insert_own on public.user_preferences;
create policy user_preferences_insert_own on public.user_preferences for insert to authenticated with check (owner_id = (select auth.uid()));
drop policy if exists user_preferences_update_own on public.user_preferences;
create policy user_preferences_update_own on public.user_preferences for update to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));

drop policy if exists saved_schedules_select_own on public.saved_schedules;
create policy saved_schedules_select_own on public.saved_schedules for select to authenticated using (owner_id = (select auth.uid()));
drop policy if exists saved_schedules_insert_own on public.saved_schedules;
create policy saved_schedules_insert_own on public.saved_schedules for insert to authenticated with check (owner_id = (select auth.uid()));
drop policy if exists saved_schedules_update_own on public.saved_schedules;
create policy saved_schedules_update_own on public.saved_schedules for update to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
drop policy if exists saved_schedules_delete_own on public.saved_schedules;
create policy saved_schedules_delete_own on public.saved_schedules for delete to authenticated using (owner_id = (select auth.uid()));

grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.households to authenticated;
grant select, insert, update, delete on public.saved_locations to authenticated;
grant select, insert, update on public.user_preferences to authenticated;
grant select, insert, update, delete on public.saved_schedules to authenticated;
