-- AMITOOLS : ouverture temporaire du centre de controle pour les tests.
-- ATTENTION : les noms, telephones et plannings deviennent lisibles sans connexion.
-- Pour revenir au mode prive, reexecuter supabase/field-teams.sql.

grant select on public.field_teams to anon, authenticated;

drop policy if exists "Equipes terrain visibles par les referents" on public.field_teams;
create policy "Equipes terrain visibles par les referents"
  on public.field_teams for select
  to anon, authenticated
  using (true);
