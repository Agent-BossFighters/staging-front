- src/ : Dossier principal contenant tout le code source
  
### Fonctionnalités principales
1. Pages (/pages)
   - Section Dashboard avec :
     - Gestion du farming (daily, monthly)
     - Système de jeu (fighting, player-map)
     - Outils TV et datalab
     - Vestiaire (vestiary)
   - Section Policy (privacy, terms)
   - Section Static (economy, homepage)
   - Section Users (login, register)

2. Features (/features)
   - Module Users avec authentification (auth.api.js, login.jsx)

3. Shared (/shared)
   - Layout
     - Header (desktop et mobile navigation)
     - Footer
     - Main layout
   - UI Components
     - Buttons et autres éléments réutilisables

4. Utils (/utils)
   - Configuration API
   - Configuration Kysely (ky-config.js)
   - Utilitaires de données (data.js)

### Configuration
- Utilisation de Vite comme bundler
- Configuration Tailwind pour le styling
- ESLint pour le linting
- Support des routes avec fichiers .routes.jsx

Cette architecture suit une approche modulaire avec :
- Séparation claire des responsabilités
- Components réutilisables dans /shared
- Organisation par fonctionnalités (features)
- Gestion des layouts et de la navigation mobile/desktop
- Structure orientée gaming/farming avec des fonctionnalités spécifiques (combat, farming, économie)