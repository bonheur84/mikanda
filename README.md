# MIKANDA — Bibliothèque Numérique Congolaise

MIKANDA est une application de bibliothèque numérique moderne conçue pour promouvoir la littérature congolaise. Elle vient d'être migrée vers une architecture React + Vite + TailwindCSS.

## Installation et Lancement

### Prérequis
- Node.js (version 18 ou supérieure recommandée)
- npm ou yarn

### Installation
```bash
npm install
```

### Lancement en développement
```bash
npm run dev
```

### Build pour la production
```bash
npm run build
```

## Architecture

Le projet suit une architecture modulaire classique pour React :
- `src/components/` : Composants UI réutilisables (layout, reader, auth, etc.)
- `src/pages/` : Pages principales de l'application publique.
- `src/admin/` : Espace d'administration (pages et layouts dédiés).
- `src/context/` : États globaux (ex: `AuthContext`).
- `src/hooks/` : Hooks personnalisés React.
- `src/services/` : Services abstraits pour le stockage, l'audio, la traduction et l'authentification.
- `src/data/` : Données de démonstration et contenus statiques (livres, auteurs).

## Authentification Simulée (LocalStorage)

Pour l'instant, l'application utilise une **authentification simulée** via LocalStorage. 

⚠️ **Limites de sécurité** :
- Les mots de passe sont hachés avec un simple encodage base64 (non sécurisé).
- Les données d'utilisateurs sont stockées en clair dans le navigateur.
- **Cette solution n'est PAS destinée à la production.** Elle sera remplacée par une véritable authentification backend.

### Compte Administrateur de Démonstration
Un compte administrateur est automatiquement généré si aucun n'existe :
- **Email** : `admin@mikanda.cd`
- **Mot de passe** : `Admin2024!`

### OAuth Google
L'intégration GitHub OAuth a été totalement supprimée. L'interface est préparée pour intégrer Google OAuth, mais nécessite la mise en place d'un backend réel (voir Prochaines étapes).

## Fonctionnalités Avancées du Lecteur

### API Audio (Text-to-Speech)
Le lecteur intègre une fonctionnalité de lecture vocale abstraite dans `src/services/audioService.js`.
Actuellement, elle utilise `window.speechSynthesis` (API native du navigateur).
**Configuration future** : Il faudra définir `VITE_TTS_API_URL` dans un fichier `.env` pour la connecter à un vrai service Cloud.

### API de Traduction
La traduction est gérée par `src/services/translationService.js`.
**Configuration future** : Elle est actuellement en "Mock Mode". Pour activer une vraie traduction, définissez `VITE_TRANSLATION_API_URL` dans le fichier `.env`. 
*Note : Ne jamais stocker de clé API secrète dans le frontend React. Les clés doivent être gérées par un proxy backend.*

## Prochaines Étapes Backend

L'architecture actuelle est conçue pour accueillir un véritable backend (ex: Node.js / Express + PostgreSQL) :
1. Remplacer `services/auth.js` par des requêtes HTTP (`fetch` ou `axios`) vers une API REST sécurisée utilisant des JWT.
2. Synchroniser les favoris, la progression de lecture et les commentaires avec la base de données.
3. Intégrer un proxy backend pour les requêtes de traduction et d'audio afin de protéger les clés API.
4. Mettre en place un stockage d'images sur le cloud (AWS S3, Cloudinary) pour les avatars et les couvertures de livres.
