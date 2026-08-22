# AMITOOLS

AMITOOLS contient trois interfaces partageant le meme catalogue reseau :

- `index.html` : application mobile des employes ;
- `referent.html` : preparation des prises de service ;
- `admin.html` : administration des lignes, zones, stations, secteurs metro et horaires.

## Source de donnees

Le catalogue initial et le client de synchronisation se trouvent dans `js/network-data.js`.
Une fois `config.js` renseigne, Supabase devient la source de verite. Les applications conservent automatiquement la derniere revision dans le navigateur afin de continuer a fonctionner hors connexion.

## Mise en service de la base

1. Creer un projet Supabase.
2. Executer `supabase/schema.sql` dans l'editeur SQL.
3. Creer le premier utilisateur referent dans Authentication > Users.
4. Ajouter son UUID dans `public.app_admins` avec la commande indiquee en bas du fichier SQL.
5. Copier l'URL du projet et la cle publique dans `config.js`.
6. Ouvrir `admin.html`, se connecter, verifier le catalogue initial puis cliquer sur **Enregistrer dans la base**.

Ne jamais placer une cle `service_role` ou une cle secrete dans `config.js`. Seule la cle publique est destinee au navigateur ; les droits d'ecriture sont controles par les politiques RLS.

## Adresses GitHub Pages

- Mobile : `https://sluggyguy.github.io/amitools/`
- Referents : `https://sluggyguy.github.io/amitools/referent.html`
- Administration : `https://sluggyguy.github.io/amitools/admin.html`
