-- AMITOOLS : catalogue reseau partage
-- A executer une seule fois dans l'editeur SQL du projet Supabase.

create table if not exists public.network_catalog (
  id text primary key,
  data jsonb not null,
  revision bigint not null default 1,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create table if not exists public.app_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.network_catalog enable row level security;
alter table public.app_admins enable row level security;

grant select on public.network_catalog to anon, authenticated;
grant insert, update, delete on public.network_catalog to authenticated;
grant select on public.app_admins to authenticated;

drop policy if exists "Catalogue lisible par les applications" on public.network_catalog;
create policy "Catalogue lisible par les applications"
  on public.network_catalog for select
  to anon, authenticated
  using (true);

drop policy if exists "Catalogue modifiable par les referents" on public.network_catalog;
create policy "Catalogue modifiable par les referents"
  on public.network_catalog for all
  to authenticated
  using (exists (select 1 from public.app_admins a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.app_admins a where a.user_id = (select auth.uid())));

drop policy if exists "Un referent peut verifier son acces" on public.app_admins;
create policy "Un referent peut verifier son acces"
  on public.app_admins for select
  to authenticated
  using (user_id = (select auth.uid()));

create or replace function public.bump_network_catalog_revision()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.revision = case when tg_op = 'INSERT' then 1 else old.revision + 1 end;
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists network_catalog_revision on public.network_catalog;
create trigger network_catalog_revision
before insert or update on public.network_catalog
for each row execute function public.bump_network_catalog_revision();

-- Apres avoir cree le premier compte referent dans Authentication > Users,
-- remplacer l'UUID ci-dessous puis executer la ligne :
-- insert into public.app_admins(user_id) values ('UUID_DU_COMPTE_REFERENT');

-- Activer Realtime pour cette table depuis Database > Replication,
-- ou executer la commande suivante si elle n'est pas deja publiee :
-- alter publication supabase_realtime add table public.network_catalog;

-- Centre de controle des equipes terrain.
-- Le script est separe pour pouvoir etre applique facilement aux projets existants.
-- Executer ensuite le contenu de : supabase/field-teams.sql
