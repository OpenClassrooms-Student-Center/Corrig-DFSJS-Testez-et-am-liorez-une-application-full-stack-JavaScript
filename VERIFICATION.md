# Liste de Vérification

Utilisez cette liste de vérification pour vérifier que toutes les améliorations ont été appliquées correctement et que l'application est entièrement fonctionnelle.

---

## Compilation TypeScript

### Backend
```bash
cd backend
npx tsc --noEmit
```

- [ ] Compile sans aucune erreur
- [ ] Zéro type `any` dans le code source

### Frontend
```bash
cd frontend
npx tsc --noEmit
```

- [ ] Compile sans aucune erreur
- [ ] Zéro type `any` dans le code source

### Vérifier l'Absence de Types `any`
```bash
# Backend (should return 0 results)
grep -r "any" backend/src/ --include="*.ts" -l

# Frontend (should return 0 results, excluding vite-env.d.ts)
grep -r "any" frontend/src/ --include="*.ts" --include="*.tsx" -l
```

---

## Architecture Backend

### Nouvelle Infrastructure
- [ ] `src/prisma.ts` - Le singleton PrismaClient existe
- [ ] `src/types/index.ts` - Les définitions de types centrales existent
- [ ] `src/errors/app-error.ts` - La hiérarchie d'erreurs existe (AppError, NotFoundError, UnauthorizedError, ForbiddenError, ConflictError, ValidationError)
- [ ] `src/middleware/error.middleware.ts` - Le gestionnaire d'erreurs global existe
- [ ] `src/middleware/async-handler.ts` - Le wrapper async existe
- [ ] `src/middleware/validate.middleware.ts` - Le middleware de validation Zod existe

### Couche Repository
- [ ] `src/repositories/user.repository.ts` existe
- [ ] `src/repositories/teacher.repository.ts` existe
- [ ] `src/repositories/session.repository.ts` existe
- [ ] `src/repositories/participation.repository.ts` existe

### Couche Service
- [ ] `src/services/auth.service.ts` existe
- [ ] `src/services/session.service.ts` existe
- [ ] `src/services/teacher.service.ts` existe
- [ ] `src/services/user.service.ts` existe

### Refactorisation des Controllers
- [ ] Les controllers ne contiennent aucun bloc try/catch
- [ ] Les controllers ne contiennent aucun import Prisma
- [ ] Les controllers ne contiennent aucune logique métier
- [ ] Les controllers appellent uniquement les méthodes de service
- [ ] Chaque méthode de controller fait ~5 lignes

### Routes
- [ ] Tous les handlers sont enveloppés avec `asyncHandler()`
- [ ] Validation du body via `validate(schema)` où nécessaire
- [ ] Validation des paramètres via `validateParams(schema)` où nécessaire
- [ ] `errorMiddleware` enregistré après les routes dans `app.ts`

### Aucun PrismaClient Dupliqué
```bash
# Should only appear in src/prisma.ts
grep -r "new PrismaClient" backend/src/ --include="*.ts"
```
- [ ] Seulement 1 instance dans `src/prisma.ts`

---

## Architecture Frontend

### Nouveaux Fichiers
- [ ] `src/components/ProtectedRoute.tsx` - Guard de route typé
- [ ] `src/hooks/useAuth.ts` - Hook d'authentification
- [ ] `src/services/session.service.ts` - Appels API des sessions
- [ ] `src/services/teacher.service.ts` - Appels API des professeurs
- [ ] `src/services/user.service.ts` - Appels API des utilisateurs
- [ ] `src/vite-env.d.ts` - Déclarations de types Vite

### Intercepteur Axios
- [ ] L'intercepteur de requête dans `src/services/api.ts` attache automatiquement le token Bearer
- [ ] Aucun header `Authorization` manuel dans les pages

### Vérifier l'Absence de Headers Auth Manuels
```bash
# Should return 0 results
grep -r "Authorization" frontend/src/pages/ --include="*.tsx"
```

### Nettoyage AbortController
- [ ] `Login.tsx` - A un AbortController dans useEffect (s'il récupère des données)
- [ ] `Sessions.tsx` - A un AbortController dans useEffect
- [ ] `SessionDetail.tsx` - A un AbortController dans useEffect
- [ ] `SessionForm.tsx` - A un AbortController dans useEffect
- [ ] `Profile.tsx` - A un AbortController dans useEffect

### Typage des Composants
- [ ] `Navbar.tsx` - Aucune prop `any`
- [ ] `ProtectedRoute.tsx` - `ProtectedRouteProps` typé
- [ ] `App.tsx` - Utilise `ProtectedRoute` (pas PrivateRoute en ligne)
- [ ] Toutes les pages - `useState` correctement typé
- [ ] Toutes les pages - Gestionnaires d'événements correctement typés

---

## Tests

### Tests Backend
```bash
cd backend && npm test
```

- [ ] 57 tests réussis
- [ ] 0 échecs

**Tests unitaires (37) :**
- [ ] `jwt.util.test.ts` - 4 tests réussis
- [ ] `auth.middleware.test.ts` - 4 tests réussis
- [ ] `auth.service.test.ts` - 6 tests réussis
- [ ] `session.service.test.ts` - 12 tests réussis
- [ ] `teacher.service.test.ts` - 4 tests réussis
- [ ] `user.service.test.ts` - 7 tests réussis

**Tests d'intégration (20) :**
- [ ] `auth.routes.test.ts` - 5 tests réussis
- [ ] `session.routes.test.ts` - 8 tests réussis
- [ ] `teacher.routes.test.ts` - 3 tests réussis
- [ ] `user.routes.test.ts` - 4 tests réussis

### Tests Frontend
```bash
cd frontend && npm test
```

- [ ] 45 tests réussis
- [ ] 0 échecs

**Tests :**
- [ ] `useAuth.test.ts` - 4 tests réussis
- [ ] `auth.service.test.ts` - 6 tests réussis
- [ ] `Navbar.test.tsx` - 4 tests réussis
- [ ] `ProtectedRoute.test.tsx` - 3 tests réussis
- [ ] `Login.test.tsx` - 5 tests réussis
- [ ] `Register.test.tsx` - 5 tests réussis
- [ ] `Sessions.test.tsx` - 6 tests réussis
- [ ] `SessionDetail.test.tsx` - 6 tests réussis
- [ ] `Profile.test.tsx` - 6 tests réussis

### Tests E2E
```bash
# Start servers first
cd frontend && npx cypress run
```

- [ ] 27 tests réussis
- [ ] 0 échecs

**Specs :**
- [ ] `auth.cy.ts` - 9 tests réussis
- [ ] `sessions.cy.ts` - 10 tests réussis
- [ ] `profile.cy.ts` - 8 tests réussis

### Couverture
```bash
cd backend && npm run test:coverage
cd frontend && npm run test:coverage
```

- [ ] Couverture backend > 85%
- [ ] Couverture frontend > 80%

---

## Fonctionnalité

### Prérequis
```bash
node --version   # Should be 22+
docker --version # Docker installed
docker ps        # PostgreSQL container running
```

### Démarrer l'Application
```bash
# Terminal 1
cd backend && npm run dev
# Should print: Server is running on port 8080

# Terminal 2
cd frontend && npm run dev
# Should print: VITE ready
```

### Test 1 : Connexion Admin
1. Ouvrir http://localhost:3000
2. Naviguer vers /login
3. Se connecter avec `yoga@studio.com` / `test!1234`
- [ ] Redirige vers /sessions
- [ ] La barre de navigation affiche : Sessions, Create Session, Profile, Logout

### Test 2 : Liste des Sessions
1. Afficher la page /sessions
- [ ] 4 cartes de session affichées
- [ ] Chaque carte a un nom, une date, une description
- [ ] Bouton "Create Session" visible (admin)
- [ ] Bouton "Delete" sur chaque carte (admin)
- [ ] Lien "View Details" sur chaque carte

### Test 3 : Détails de Session
1. Cliquer sur "View Details" sur n'importe quelle session
- [ ] Nom de la session, description visibles
- [ ] Nom du professeur visible
- [ ] Nombre de participants visible
- [ ] Bouton "Edit" visible (admin)
- [ ] Lien "Back to Sessions" visible

### Test 4 : Créer une Session (Admin)
1. Cliquer sur "Create Session"
2. Remplir le formulaire : nom, date, professeur, description
3. Soumettre
- [ ] Redirige vers /sessions
- [ ] La nouvelle session apparaît dans la liste

### Test 5 : Modifier une Session (Admin)
1. Afficher les détails de la session
2. Cliquer sur "Edit"
3. Changer le nom
4. Soumettre
- [ ] Redirige vers /sessions
- [ ] Le nom mis à jour est visible

### Test 6 : Supprimer une Session (Admin)
1. Cliquer sur "Delete" sur une carte de session
- [ ] La session est retirée de la liste

### Test 7 : Déconnexion
1. Cliquer sur "Logout"
- [ ] Redirige vers /login
- [ ] La barre de navigation affiche Login/Register

### Test 8 : Connexion Utilisateur Régulier
1. Se connecter avec `user@test.com` / `test!1234`
- [ ] Redirige vers /sessions
- [ ] Aucun bouton "Create Session"
- [ ] Aucun bouton "Delete" sur les cartes

### Test 9 : Rejoindre/Quitter une Session
1. En tant qu'utilisateur régulier, afficher les détails d'une session
2. Cliquer sur "Join Session"
- [ ] Le bouton change en "Leave Session"
- [ ] Le nombre de participants augmente
3. Cliquer sur "Leave Session"
- [ ] Le bouton change en "Join Session"
- [ ] Le nombre de participants diminue

### Test 10 : Profil Utilisateur
1. Cliquer sur "Profile"
- [ ] Prénom, nom, email visibles
- [ ] Badge de rôle visible ("User" ou "Administrator")
- [ ] Date "Member Since" visible
- [ ] Bouton "Delete Account" visible
- [ ] Lien "Back to Sessions" visible

### Test 11 : Enregistrer un Nouvel Utilisateur
1. Se déconnecter
2. Naviguer vers /register
3. Remplir : prénom, nom, email, mot de passe
4. Soumettre
- [ ] Redirige vers /sessions
- [ ] Le nouvel utilisateur est connecté

### Test 12 : Supprimer le Compte
1. Créer un compte temporaire
2. Aller sur /profile
3. Cliquer sur "Delete Account"
- [ ] Redirige vers /login
- [ ] Impossible d'accéder à /sessions (redirige vers /login)

---

## Vérification des Points de Terminaison API

### Health Check
```bash
curl http://localhost:8080/api/health
```
- [ ] Retourne `{ "status": "ok", "message": "Yoga Studio API is running" }`

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"yoga@studio.com","password":"test!1234"}'
```
- [ ] Retourne 200 avec `{ id, email, firstName, lastName, admin, token }`

### Route Protégée Sans Token
```bash
curl http://localhost:8080/api/session
```
- [ ] Retourne 401 `{ "message": "..." }`

### Route Protégée Avec Token
```bash
TOKEN="<token from login>"
curl http://localhost:8080/api/session \
  -H "Authorization: Bearer $TOKEN"
```
- [ ] Retourne 200 avec un tableau de sessions

---

## Validation Finale

- [ ] Le backend compile proprement (zéro erreurs, zéro `any`)
- [ ] Le frontend compile proprement (zéro erreurs, zéro `any`)
- [ ] 57 tests backend réussis
- [ ] 45 tests frontend réussis
- [ ] 27 tests E2E réussis
- [ ] Tous les 27 anti-patterns corrigés
- [ ] Application entièrement fonctionnelle
- [ ] Objectifs de couverture atteints

**Statut :** _______________

**Date :** _______________
