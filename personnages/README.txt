DOSSIER DES PERSONNAGES PAR DEFAUT

Mets ici les fichiers JSON exportes depuis le site.

Noms attendus actuellement :
- timble.json
- shamash.json
- salomon.json
- sarcine.json
- kaelen.json

Pour ajouter un autre personnage :
1. Ajoute son fichier JSON dans ce dossier.
2. Ouvre personnages.json.
3. Ajoute une ligne dans "characters" avec :
   - id : identifiant simple, sans espace ni accent
   - name : nom affiche dans le site
   - file : nom exact du fichier JSON
4. Fais :
   git add .
   git commit -m "Ajout personnages par defaut"
   git push

Important :
- Les JSON servent de configuration par defaut.
- Le site les charge automatiquement au demarrage.
- Si un utilisateur a deja une sauvegarde locale dans son navigateur, elle est conservee.
