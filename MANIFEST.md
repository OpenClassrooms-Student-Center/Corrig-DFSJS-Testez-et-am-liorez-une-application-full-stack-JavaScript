# Manifeste du Projet - Solution Yoga Studio p4-dfsjs

**Nom du Projet :** Yoga Studio App
**Code Projet :** p4-dfsjs
**Version :** 2.0.0 (Solution)
**Généré le :** 2026-02-16
**Objectif :** Code base refactorisée avec tous les anti-patterns corrigés et suite de tests complète

---

## Contenu du Package

### Fichiers de Documentation
- `README.md` - Documentation principale du projet
- `MANIFEST.md` - Ce fichier
- `PROJECT_STRUCTURE.md` - Structure complète des fichiers
- `ANTI-PATTERNS.md` - Anti-patterns identifiés et corrections appliquées
- `TESTING_GUIDE.md` - Configuration des tests et rapport de couverture
- `VERIFICATION.md` - Liste de vérification
- `DEPENDENCIES.md` - Liste complète des dépendances

### Fichiers de Configuration (16)
- `.gitignore` - Règles d'exclusion Git
- `docker-compose.yml` - Conteneur PostgreSQL
- `backend/package.json` - Dépendances backend
- `backend/tsconfig.json` - Configuration TypeScript backend
- `backend/nodemon.json` - Configuration Nodemon
- `backend/vitest.config.ts` - Configuration des tests backend
- `backend/.env` - Variables d'environnement (pré-configurées)
- `backend/.env.example` - Modèle d'environnement
- `frontend/package.json` - Dépendances frontend
- `frontend/tsconfig.json` - Configuration TypeScript frontend
- `frontend/tsconfig.node.json` - Configuration TypeScript Vite
- `frontend/vite.config.ts` - Configuration Vite (inclut la config des tests)
- `frontend/tailwind.config.js` - Configuration TailwindCSS
- `frontend/index.html` - Point d'entrée HTML
- `frontend/cypress.config.ts` - Configuration Cypress E2E
- `frontend/cypress/tsconfig.json` - Configuration TypeScript Cypress

### Fichiers Source Backend (28)
- `backend/src/app.ts` - Point d'entrée de l'application Express
- `backend/src/prisma.ts` - **NOUVEAU** Instance Singleton PrismaClient
- `backend/src/types/index.ts` - **NOUVEAU** Définitions de types centrales (JwtPayload, AuthRequest, DTOs)
- `backend/src/errors/app-error.ts` - **NOUVEAU** Hiérarchie d'erreurs (AppError, NotFoundError, etc.)
- `backend/src/routes/index.ts` - Routes API (avec asyncHandler + middleware de validation)
- `backend/src/controllers/auth.controller.ts` - Points de terminaison d'authentification (wrapper léger)
- `backend/src/controllers/session.controller.ts` - CRUD des sessions (wrapper léger)
- `backend/src/controllers/teacher.controller.ts` - Points de terminaison des professeurs (wrapper léger)
- `backend/src/controllers/user.controller.ts` - Points de terminaison des utilisateurs (wrapper léger)
- `backend/src/services/auth.service.ts` - **NOUVEAU** Logique métier d'authentification
- `backend/src/services/session.service.ts` - **NOUVEAU** Logique métier des sessions
- `backend/src/services/teacher.service.ts` - **NOUVEAU** Logique métier des professeurs
- `backend/src/services/user.service.ts` - **NOUVEAU** Logique métier des utilisateurs
- `backend/src/repositories/user.repository.ts` - **NOUVEAU** Accès aux données utilisateurs
- `backend/src/repositories/teacher.repository.ts` - **NOUVEAU** Accès aux données professeurs
- `backend/src/repositories/session.repository.ts` - **NOUVEAU** Accès aux données sessions
- `backend/src/repositories/participation.repository.ts` - **NOUVEAU** Accès aux données participations
- `backend/src/middleware/auth.middleware.ts` - Authentification JWT (typé, lance des erreurs)
- `backend/src/middleware/error.middleware.ts` - **NOUVEAU** Gestionnaire d'erreurs global
- `backend/src/middleware/async-handler.ts` - **NOUVEAU** Wrapper d'erreurs asynchrones
- `backend/src/middleware/validate.middleware.ts` - **NOUVEAU** Middleware de validation Zod
- `backend/src/dto/auth.dto.ts` - Schémas de validation d'authentification (+ IdParamSchema)
- `backend/src/dto/session.dto.ts` - Schémas de validation des sessions (+ ParticipationParamSchema)
- `backend/src/utils/jwt.util.ts` - Utilitaires JWT (retour typé)
- `backend/prisma/schema.prisma` - Schéma de base de données
- `backend/prisma/seed.ts` - Script de peuplement de la base de données

### Fichiers de Tests Backend (11)
- `backend/tests/setup.ts` - Mock Prisma global
- `backend/tests/unit/utils/jwt.util.test.ts` - 4 tests
- `backend/tests/unit/middleware/auth.middleware.test.ts` - 4 tests
- `backend/tests/unit/services/auth.service.test.ts` - 6 tests
- `backend/tests/unit/services/session.service.test.ts` - 12 tests
- `backend/tests/unit/services/teacher.service.test.ts` - 4 tests
- `backend/tests/unit/services/user.service.test.ts` - 7 tests
- `backend/tests/integration/auth.routes.test.ts` - 5 tests
- `backend/tests/integration/session.routes.test.ts` - 8 tests
- `backend/tests/integration/teacher.routes.test.ts` - 3 tests
- `backend/tests/integration/user.routes.test.ts` - 4 tests

### Fichiers Source Frontend (20)
- `frontend/src/main.tsx` - Point d'entrée React
- `frontend/src/App.tsx` - Composant App avec routage (utilise ProtectedRoute)
- `frontend/src/index.css` - Styles globaux
- `frontend/src/vite-env.d.ts` - **NOUVEAU** Déclarations de types Vite
- `frontend/src/components/Navbar.tsx` - Composant de navigation (typé)
- `frontend/src/components/ProtectedRoute.tsx` - **NOUVEAU** Garde de route typé
- `frontend/src/hooks/useAuth.ts` - **NOUVEAU** Hook d'authentification
- `frontend/src/pages/Login.tsx` - Page de connexion (typé, AbortController)
- `frontend/src/pages/Register.tsx` - Page d'inscription (typé, AbortController)
- `frontend/src/pages/Sessions.tsx` - Liste des sessions (typé, AbortController)
- `frontend/src/pages/SessionDetail.tsx` - Détail de session (typé, AbortController)
- `frontend/src/pages/SessionForm.tsx` - Créer/Modifier session (typé, AbortController)
- `frontend/src/pages/Profile.tsx` - Profil utilisateur (typé, AbortController)
- `frontend/src/services/api.ts` - Configuration Axios (avec intercepteur de requête)
- `frontend/src/services/auth.service.ts` - Service d'authentification (typé)
- `frontend/src/services/session.service.ts` - **NOUVEAU** Appels API sessions
- `frontend/src/services/teacher.service.ts` - **NOUVEAU** Appels API professeurs
- `frontend/src/services/user.service.ts` - **NOUVEAU** Appels API utilisateurs
- `frontend/src/types/index.ts` - Types TypeScript (+ ApiError)

### Fichiers de Tests Frontend (10)
- `frontend/tests/setup.ts` - Configuration des tests (jest-dom, mock localStorage)
- `frontend/tests/hooks/useAuth.test.ts` - 4 tests
- `frontend/tests/services/auth.service.test.ts` - 6 tests
- `frontend/tests/components/Navbar.test.tsx` - 4 tests
- `frontend/tests/components/ProtectedRoute.test.tsx` - 3 tests
- `frontend/tests/pages/Login.test.tsx` - 5 tests
- `frontend/tests/pages/Register.test.tsx` - 5 tests
- `frontend/tests/pages/Sessions.test.tsx` - 6 tests
- `frontend/tests/pages/SessionDetail.test.tsx` - 6 tests
- `frontend/tests/pages/Profile.test.tsx` - 6 tests

### Fichiers Cypress E2E (5)
- `frontend/cypress/support/commands.ts` - cy.login() / cy.register() personnalisés
- `frontend/cypress/support/e2e.ts` - Fichier de support
- `frontend/cypress/e2e/auth.cy.ts` - 9 tests
- `frontend/cypress/e2e/sessions.cy.ts` - 10 tests
- `frontend/cypress/e2e/profile.cy.ts` - 8 tests

**Total des Fichiers Source :** 83 fichiers (hors node_modules, coverage, lock files)

---

## Changements par rapport au Starter

### Nouveaux Fichiers Créés (30)
| Fichier | Objectif |
|---------|----------|
| `backend/src/prisma.ts` | Singleton PrismaClient (remplace 4 instances séparées) |
| `backend/src/types/index.ts` | Définitions de types centrales |
| `backend/src/errors/app-error.ts` | Hiérarchie de classes d'erreurs |
| `backend/src/middleware/error.middleware.ts` | Gestionnaire d'erreurs global |
| `backend/src/middleware/async-handler.ts` | Wrapper de gestionnaire asynchrone |
| `backend/src/middleware/validate.middleware.ts` | Middleware de validation Zod |
| `backend/src/repositories/*.ts` (4) | Couche repository |
| `backend/src/services/*.ts` (4) | Couche service |
| `backend/vitest.config.ts` | Configuration des tests backend |
| `backend/tests/**/*.test.ts` (11) | 57 tests backend |
| `frontend/src/components/ProtectedRoute.tsx` | Garde de route typé |
| `frontend/src/hooks/useAuth.ts` | Hook d'authentification |
| `frontend/src/services/session.service.ts` | Module API sessions |
| `frontend/src/services/teacher.service.ts` | Module API professeurs |
| `frontend/src/services/user.service.ts` | Module API utilisateurs |
| `frontend/src/vite-env.d.ts` | Déclarations de types Vite |
| `frontend/tests/**/*.test.{ts,tsx}` (10) | 45 tests frontend |
| `frontend/cypress/**` (5) | 27 tests E2E |
| `frontend/cypress.config.ts` | Configuration Cypress |

### Fichiers Modifiés (20)
| Fichier | Changements |
|---------|-------------|
| `backend/src/app.ts` | Ajout errorMiddleware, protection listen avec NODE_ENV |
| `backend/src/routes/index.ts` | Ajout asyncHandler, validate, validateParams |
| `backend/src/controllers/*.ts` (4) | Réécrits comme wrappers de service légers |
| `backend/src/middleware/auth.middleware.ts` | Typé, lance UnauthorizedError |
| `backend/src/dto/auth.dto.ts` | Ajout IdParamSchema |
| `backend/src/dto/session.dto.ts` | Ajout ParticipationParamSchema |
| `backend/src/utils/jwt.util.ts` | Type de retour `JwtPayload \| null` |
| `backend/package.json` | Ajout dépendances et scripts de test |
| `backend/tsconfig.json` | Ajout tests à l'exclusion |
| `frontend/src/App.tsx` | Utilise ProtectedRoute |
| `frontend/src/components/Navbar.tsx` | Props et retour typés |
| `frontend/src/pages/*.tsx` (6) | Tous typés, AbortController, services |
| `frontend/src/services/api.ts` | Ajout intercepteur de requête |
| `frontend/src/services/auth.service.ts` | Valeurs de retour typées |
| `frontend/src/types/index.ts` | Ajout ApiError |
| `frontend/package.json` | Ajout dépendances et scripts de test |
| `frontend/vite.config.ts` | Ajout bloc de configuration des tests |

---

## Anti-Patterns Corrigés

### Backend (15 corrigés)
1. Blocs try/catch répétitifs dans chaque méthode de contrôleur -> asyncHandler + middleware d'erreur global
2. Contrôleurs appelant Prisma directement -> Couches Repository + Service
3. Logique métier dans les contrôleurs -> Extraite dans les services
4. Validations manuelles avec if/else -> Middleware de validation Zod
5. Utilisation extensive du type `any` -> Types TypeScript appropriés
6. Pas de middleware de gestion d'erreur global -> errorMiddleware
7. Vérifications d'autorisation répétitives -> Centralisées dans les services
8. Pas de middleware de validation de requête -> validate() / validateParams()
9. Préoccupations mélangées dans les contrôleurs -> Architecture en couches
10. Multiples instances PrismaClient -> Singleton prisma.ts
11. Interface AuthRequest inline -> Déplacée dans types/index.ts
12. jwt.util retournant `any` -> Retourne `JwtPayload | null`
13. Middleware d'authentification utilisant res.json() pour les erreurs -> Lance UnauthorizedError
14. Pas de schémas Zod pour les paramètres de route -> IdParamSchema, ParticipationParamSchema
15. Pas de séparation entre accès aux données et logique métier -> Pattern Repository

### Frontend (12 corrigés)
1. useEffect sans nettoyage -> AbortController dans tous les effets de récupération de données
2. Props typés avec `any` -> Interfaces typées (NavbarProps, ProtectedRouteProps)
3. Types de retour de fonction non spécifiés -> `Promise<void>`, `ReactNode`, etc.
4. Rendu conditionnel verbeux -> Patterns `&&` concis
5. Variables d'état typées avec `any` -> `Session[]`, `string`, `boolean`, etc.
6. Pas d'intercepteurs Axios -> Intercepteur de requête attache automatiquement le token Bearer
7. Pattern d'appels API répétitifs -> Modules de service dédiés
8. Pas de hooks personnalisés -> Hook useAuth
9. Gestionnaires d'événements typés comme `any` -> FormEvent, ChangeEvent
10. Blocs catch utilisant `any` -> Typage `AxiosError<ApiError>`
11. Composant PrivateRoute inline -> Composant ProtectedRoute dédié
12. En-têtes Authorization manuels -> Gérés par l'intercepteur

**Total corrigé : 27 anti-patterns**

---

## Résumé des Tests

### Tests Backend : 57 tests
| Suite | Tests | Type |
|-------|-------|------|
| jwt.util | 4 | Unit |
| auth.middleware | 4 | Unit |
| auth.service | 6 | Unit |
| session.service | 12 | Unit |
| teacher.service | 4 | Unit |
| user.service | 7 | Unit |
| auth.routes | 5 | Integration |
| session.routes | 8 | Integration |
| teacher.routes | 3 | Integration |
| user.routes | 4 | Integration |

### Tests Frontend : 45 tests
| Suite | Tests | Type |
|-------|-------|------|
| useAuth | 4 | Unit |
| auth.service | 6 | Unit |
| Navbar | 4 | Component |
| ProtectedRoute | 3 | Component |
| Login | 5 | Page |
| Register | 5 | Page |
| Sessions | 6 | Page |
| SessionDetail | 6 | Page |
| Profile | 6 | Page |

### Tests E2E : 27 tests
| Suite | Tests |
|-------|-------|
| auth | 9 |
| sessions | 10 |
| profile | 8 |

**Total Général : 129 tests**

---

## Stack Technologique

### Backend
| Technologie | Version | Objectif |
|-------------|---------|----------|
| Node.js | 22 LTS | Runtime |
| TypeScript | 5.4+ | Langage |
| Express | 4.x | Framework web |
| Prisma | 5.x | ORM |
| PostgreSQL | 16 | Base de données |
| JWT | 9.x | Authentification |
| bcrypt | 5.x | Hachage de mots de passe |
| Zod | 3.x | Validation |
| Vitest | latest | Framework de tests |
| Supertest | latest | Tests HTTP |

### Frontend
| Technologie | Version | Objectif |
|-------------|---------|----------|
| React | 19.x | Bibliothèque UI |
| TypeScript | 5.4+ | Langage |
| Vite | 7.x | Outil de build |
| TailwindCSS | 4.0 | Stylisation |
| React Router | 6.x | Routage |
| Axios | 1.x | Client HTTP |
| Vitest | latest | Framework de tests |
| Testing Library | latest | Tests de composants |
| Cypress | latest | Tests E2E |

### Infrastructure
| Technologie | Version | Objectif |
|-------------|---------|----------|
| Docker | Latest | Conteneurisation |
| Docker Compose | Latest | Multi-conteneurs |
| PostgreSQL | 16-alpine | Base de données |

---

## Architecture

### Architecture Backend en Couches
```
Requête → Routes → [validate] → [authMiddleware] → Controller → Service → Repository → Prisma → DB
                                                                                          ↓
Réponse ← [errorMiddleware] ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← (AppError)
```

### Flux de Données Frontend
```
Composant → useEffect (avec AbortController) → Module Service → Axios (avec intercepteur) → API
                                                                        ↓ (token Bearer auto)
Composant ← setState ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← Réponse
```

---

## Identifiants par Défaut

### Compte Administrateur
```
Email: yoga@studio.com
Mot de passe: test!1234
```

### Compte Utilisateur Standard
```
Email: user@test.com
Mot de passe: test!1234
```

---

## Exécution de l'Application

### Installation Initiale
```bash
cd backend && npm install
cd ../frontend && npm install
cd .. && docker-compose up -d
cd backend
npx prisma migrate dev --name init
npm run prisma:seed
```

### Démarrage des Serveurs
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### Exécution des Tests
```bash
# Tests backend
cd backend && npm test

# Tests frontend
cd frontend && npm test

# Tests E2E (nécessite les serveurs en cours d'exécution)
cd frontend && npx cypress open
```

### Points d'Accès
- Frontend: http://localhost:3000
- API Backend: http://localhost:8080
- Base de données: localhost:5432

---

## Points de Terminaison API

### Points de Terminaison Publics
- `POST /api/auth/register` - Créer un compte
- `POST /api/auth/login` - Obtenir un token JWT

### Points de Terminaison Protégés (Nécessitent JWT)
- `GET /api/session` - Lister les sessions
- `GET /api/session/:id` - Obtenir une session
- `POST /api/session` - Créer une session (admin)
- `PUT /api/session/:id` - Modifier une session (admin)
- `DELETE /api/session/:id` - Supprimer une session (admin)
- `POST /api/session/:id/participate/:userId` - Rejoindre une session
- `DELETE /api/session/:id/participate/:userId` - Quitter une session
- `GET /api/teacher` - Lister les professeurs
- `GET /api/teacher/:id` - Obtenir un professeur
- `GET /api/user/:id` - Obtenir un utilisateur
- `DELETE /api/user/:id` - Supprimer un utilisateur

**Total des Points de Terminaison :** 13 (incluant health check)

---

## Vérification

1. **Backend compile** : `cd backend && npx tsc --noEmit` (zéro erreur, zéro `any`)
2. **Frontend compile** : `cd frontend && npx tsc --noEmit` (zéro erreur, zéro `any`)
3. **Tests backend** : `cd backend && npm test` (57 tests passent)
4. **Tests frontend** : `cd frontend && npm test` (45 tests passent)
5. **Tests E2E** : Démarrer les serveurs, puis `cd frontend && npx cypress run` (27 tests passent)
6. **Application fonctionne** : Connexion, parcourir les sessions, rejoindre/quitter, créer/modifier/supprimer en tant qu'admin
