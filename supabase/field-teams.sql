-- AMITOOLS : centre de controle des equipes terrain
-- A executer dans l'editeur SQL du projet Supabase existant.

create table if not exists public.field_teams (
  id text primary key check (id ~ '^[0-9a-f]{64}$'),
  service_date date not null,
  team_label text not null check (char_length(team_label) between 1 and 80),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.field_teams enable row level security;

revoke all on public.field_teams from anon;
grant select, delete on public.field_teams to authenticated;

drop policy if exists "Equipes terrain visibles par les referents" on public.field_teams;
create policy "Equipes terrain visibles par les referents"
  on public.field_teams for select
  to authenticated
  using (exists (select 1 from public.app_admins a where a.user_id = (select auth.uid())));

drop policy if exists "Equipes terrain supprimables par les referents" on public.field_teams;
create policy "Equipes terrain supprimables par les referents"
  on public.field_teams for delete
  to authenticated
  using (exists (select 1 from public.app_admins a where a.user_id = (select auth.uid())));

create or replace function public.publish_field_team(
  p_team_key text,
  p_service_date date,
  p_team_label text,
  p_data jsonb
)
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare
  saved_at timestamptz := now();
begin
  if p_team_key is null or p_team_key !~ '^[0-9a-f]{64}$' then
    raise exception 'Cle equipe invalide';
  end if;
  if p_service_date is null or p_service_date < current_date - 7 or p_service_date > current_date + 31 then
    raise exception 'Date de service invalide';
  end if;
  if p_team_label is null or char_length(btrim(p_team_label)) not between 1 and 80 then
    raise exception 'Nom equipe invalide';
  end if;
  if p_data is null or octet_length(p_data::text) > 100000 then
    raise exception 'Donnees equipe invalides';
  end if;

  insert into public.field_teams (id, service_date, team_label, data, updated_at)
  values (p_team_key, p_service_date, btrim(p_team_label), p_data, saved_at)
  on conflict (id) do update set
    service_date = excluded.service_date,
    team_label = excluded.team_label,
    data = excluded.data,
    updated_at = excluded.updated_at;

  return saved_at;
end;
$$;

create or replace function public.archive_field_team(p_team_key text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_team_key is null or p_team_key !~ '^[0-9a-f]{64}$' then
    raise exception 'Cle equipe invalide';
  end if;

  update public.field_teams
  set data = jsonb_set(data, '{active}', 'false'::jsonb, true), updated_at = now()
  where id = p_team_key;
end;
$$;

revoke all on function public.publish_field_team(text, date, text, jsonb) from public;
revoke all on function public.archive_field_team(text) from public;
grant execute on function public.publish_field_team(text, date, text, jsonb) to anon, authenticated;
grant execute on function public.archive_field_team(text) to anon, authenticated;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'field_teams'
  ) then
    alter publication supabase_realtime add table public.field_teams;
  end if;
end;
$$;
