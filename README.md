# Fauche Lumiere - Compagnon DND

Prototype statique pour un compagnon DND en ligne: fiche de personnage, combat, journal, grimoire, jets de dés, initiative et sauvegarde locale dans le navigateur.

## Lancer en local

Ouvre `index.html` dans un navigateur, ou lance un serveur statique dans ce dossier:

```powershell
node server.cjs
```

Puis va sur `http://127.0.0.1:5183/`.

## Hébergement

Comme l'app n'a aucune dépendance, tu peux la déposer telle quelle sur:

- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages

Le stockage actuel est local au navigateur. Pour synchroniser plusieurs appareils, il faudra ajouter une couche compte + base de données, par exemple Supabase, Firebase ou PocketBase.

Le grimoire embarque un corpus initial SRD 5.1 et accepte les sorts homebrew.


## Ajouts locaux

- Sauvegarde locale par personnage.
- Import/export JSON de personnage.
- Bibliotheque d'armes courantes + armes homebrew.
- Schema de blessures en combat.
- Quetes multiples avec statut.
- Affichage du niveau et du type de degats des sorts.
