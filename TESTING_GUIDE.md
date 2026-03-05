# Guide de Test

Documentation complète pour la suite de tests du Studio de Yoga.

## Stack de Test

| Outil | Objectif | Emplacement |
|------|---------|----------|
| Vitest | Tests unitaires + d'intégration backend | `backend/tests/` |
| Supertest | Tests des endpoints HTTP | `backend/tests/integration/` |
| Vitest | Tests unitaires + de composants frontend | `frontend/tests/` |
| Testing Library | Rendu des composants React | `frontend/tests/` |
| Cypress | Tests E2E navigateur | `frontend/cypress/` |

## Exécution des Tests

### Tests Backend
```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test -- --watch

# Run with coverage report
npm run test:coverage

# Run specific test file
npm run test -- tests/unit/services/auth.service.test.ts
```

### Tests Frontend
```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm run test -- --watch

# Run with coverage report
npm run test:coverage

# Run specific test file
npm run test -- tests/pages/Login.test.tsx
```

### Tests E2E (Cypress)
```bash
# Prerequisites: backend + frontend must be running
# Terminal 1: cd backend && npm run dev
# Terminal 2: cd frontend && npm run dev

cd frontend

# Open Cypress GUI
npx cypress open

# Run headless
npx cypress run
```

---

## Tests Backend (57 tests)

### Configuration

**`backend/vitest.config.ts`:**
- Environnement : `node`
- Fichier de configuration : `tests/setup.ts` (mock Prisma global)
- Pattern : `tests/**/*.test.ts`
- Couverture : fournisseur v8

**`backend/tests/setup.ts`:**
- Mocke le module `../src/prisma` globalement
- Fournit une instance `vi.mocked(prisma)` pour tous les tests
- Chaque test peut remplacer le comportement du mock si nécessaire

### Tests Unitaires (37 tests)

#### Utilitaire JWT (`tests/unit/utils/jwt.util.test.ts`) - 4 tests
| Test | Description |
|------|-------------|
| should generate a valid JWT token | Vérifie que le token est une chaîne non vide |
| should generate different tokens for different users | Unicité du token par userId |
| should verify a valid token and return payload | Le décodage retourne le userId correct |
| should return null for an invalid token | Une chaîne invalide retourne null |

#### Middleware Auth (`tests/unit/middleware/auth.middleware.test.ts`) - 4 tests
| Test | Description |
|------|-------------|
| should throw if no authorization header | En-tête manquant -> UnauthorizedError |
| should throw if authorization format is invalid | Bearer malformé -> UnauthorizedError |
| should throw if token is invalid | Mauvais token -> UnauthorizedError |
| should set userId and call next for valid token | Token valide remplit req.userId |

#### Service Auth (`tests/unit/services/auth.service.test.ts`) - 6 tests
| Test | Description |
|------|-------------|
| should login with valid credentials | Retourne utilisateur + token |
| should throw on invalid email | Email inexistant -> NotFoundError |
| should throw on wrong password | Mauvais mot de passe -> UnauthorizedError |
| should register a new user | Crée l'utilisateur, hache le mot de passe, retourne le token |
| should throw on duplicate email | Email existant -> ConflictError |
| should hash password on register | Mot de passe stocké != texte brut |

#### Service Session (`tests/unit/services/session.service.test.ts`) - 12 tests
| Test | Description |
|------|-------------|
| should return all sessions | Mappe les sessions vers des DTOs de réponse |
| should return session by id | Recherche d'une session unique |
| should throw if session not found | ID invalide -> NotFoundError |
| should create session as admin | Admin crée une session avec succès |
| should throw if non-admin creates session | Utilisateur régulier -> ForbiddenError |
| should throw if teacher not found on create | Professeur manquant -> NotFoundError |
| should update session | Admin met à jour les champs |
| should delete session | Admin supprime la session |
| should participate in session | Utilisateur rejoint la session |
| should throw if already participating | Participation en double -> ConflictError |
| should unparticipate from session | Utilisateur quitte la session |
| should throw if participation not found | Non participant -> NotFoundError |

#### Service Teacher (`tests/unit/services/teacher.service.test.ts`) - 4 tests
| Test | Description |
|------|-------------|
| should return all teachers | Retourne la liste complète des professeurs |
| should return teacher by id | Recherche d'un professeur unique |
| should throw if teacher not found | ID invalide -> NotFoundError |
| should return empty array if no teachers | Cas de liste vide |

#### Service User (`tests/unit/services/user.service.test.ts`) - 7 tests
| Test | Description |
|------|-------------|
| should return user by id | Retourne l'utilisateur sans mot de passe |
| should throw if user not found | ID invalide -> NotFoundError |
| should delete own account | Auto-suppression réussit |
| should throw if deleting other user | Autre utilisateur -> ForbiddenError |
| should promote self to admin | Promotion admin en mode dev |
| should throw if user not found on promote | ID invalide -> NotFoundError |
| should throw if already admin | Déjà admin -> ConflictError |

### Tests d'Intégration (20 tests)

Les tests d'intégration utilisent Supertest contre l'application Express avec Prisma mocké.

#### Routes Auth (`tests/integration/auth.routes.test.ts`) - 5 tests
| Test | Description |
|------|-------------|
| POST /api/auth/register - valid | 201 + utilisateur + token |
| POST /api/auth/register - invalid body | 400 erreur de validation |
| POST /api/auth/login - valid | 200 + utilisateur + token |
| POST /api/auth/login - wrong password | 401 non autorisé |
| POST /api/auth/login - missing fields | 400 erreur de validation |

#### Routes Session (`tests/integration/session.routes.test.ts`) - 8 tests
| Test | Description |
|------|-------------|
| GET /api/session - authenticated | 200 + tableau de sessions |
| GET /api/session - unauthenticated | 401 non autorisé |
| GET /api/session/:id - found | 200 + session unique |
| GET /api/session/:id - not found | 404 non trouvé |
| POST /api/session - admin creates | 201 + nouvelle session |
| POST /api/session - validation error | 400 requête invalide |
| PUT /api/session/:id - admin updates | 200 + session mise à jour |
| DELETE /api/session/:id - admin deletes | 200 succès |

#### Routes Teacher (`tests/integration/teacher.routes.test.ts`) - 3 tests
| Test | Description |
|------|-------------|
| GET /api/teacher - authenticated | 200 + tableau de professeurs |
| GET /api/teacher - unauthenticated | 401 non autorisé |
| GET /api/teacher/:id - not found | 404 non trouvé |

#### Routes User (`tests/integration/user.routes.test.ts`) - 4 tests
| Test | Description |
|------|-------------|
| GET /api/user/:id - own profile | 200 + données utilisateur |
| DELETE /api/user/:id - delete self | 200 succès |
| GET /api/user/:id - without token | 401 non autorisé |
| DELETE /api/user/:id - delete other | 403 interdit |

---

## Tests Frontend (45 tests)

### Configuration

**`frontend/vite.config.ts` (bloc test):**
- Environnement : `jsdom`
- Fichier de configuration : `tests/setup.ts`
- Pattern : `tests/**/*.{test,spec}.{ts,tsx}`
- Couverture : fournisseur v8

**`frontend/tests/setup.ts`:**
- Importe `@testing-library/jest-dom/vitest` (étend expect avec des matchers DOM)
- Mocke `localStorage` avec un stockage en mémoire
- Vide localStorage avant chaque test

### Tests de Hooks

#### useAuth (`tests/hooks/useAuth.test.ts`) - 4 tests
| Test | Description |
|------|-------------|
| should return not authenticated when no user | Pas de localStorage -> false |
| should return authenticated when user exists | A localStorage -> true |
| should detect admin users | admin: true -> isAdmin |
| should clear state on logout | Logout vide localStorage |

### Tests de Services

#### Service Auth (`tests/services/auth.service.test.ts`) - 6 tests
| Test | Description |
|------|-------------|
| should call login API and store token | POST /auth/login + localStorage |
| should call register API and store token | POST /auth/register + localStorage |
| should clear token on logout | localStorage.removeItem appelé |
| should return current user from localStorage | Parse le JSON stocké |
| should return null if no user stored | Clé manquante -> null |
| should check isAuthenticated | Vérification de la présence du token |

### Tests de Composants

#### Navbar (`tests/components/Navbar.test.tsx`) - 4 tests
| Test | Description |
|------|-------------|
| should show login link when not authenticated | Invité voit Login/Register |
| should show logout when authenticated | Utilisateur voit Logout |
| should show Create Session for admin | Admin voit Create Session |
| should handle logout | Vide l'auth et redirige |

#### ProtectedRoute (`tests/components/ProtectedRoute.test.tsx`) - 3 tests
| Test | Description |
|------|-------------|
| should redirect to /login when not authenticated | Invité -> redirection |
| should render children when authenticated | Utilisateur -> children visibles |
| should check authentication status | Appelle isAuthenticated |

### Tests de Pages

#### Login (`tests/pages/Login.test.tsx`) - 5 tests
| Test | Description |
|------|-------------|
| should render login form | Éléments du formulaire visibles |
| should handle input changes | Les champs acceptent la saisie |
| should call login on submit | Service appelé avec les identifiants |
| should display error message | Erreur API affichée |
| should show link to register | Lien d'inscription présent |

#### Register (`tests/pages/Register.test.tsx`) - 5 tests
| Test | Description |
|------|-------------|
| should render register form | Les 4 champs visibles |
| should handle input changes | Les champs acceptent la saisie |
| should call register on submit | Service appelé avec les données |
| should display error message | Erreur API affichée |
| should show link to login | Lien de connexion présent |

#### Sessions (`tests/pages/Sessions.test.tsx`) - 6 tests
| Test | Description |
|------|-------------|
| should show loading state | Indicateur de chargement visible |
| should display sessions | Cartes de session rendues |
| should show View Details links | Liens de navigation présents |
| should show Create Session for admin | Bouton admin visible |
| should hide Create Session for non-admin | Utilisateur régulier -> masqué |
| should handle delete session | Delete supprime la carte |

#### SessionDetail (`tests/pages/SessionDetail.test.tsx`) - 6 tests
| Test | Description |
|------|-------------|
| should show loading state | Indicateur de chargement visible |
| should display session details | Nom, professeur, date visibles |
| should show Join button | Non participant -> Join |
| should show Leave button when participating | Participant -> Leave |
| should handle join session | API Join appelée |
| should display error | Message d'erreur affiché |

#### Profile (`tests/pages/Profile.test.tsx`) - 6 tests
| Test | Description |
|------|-------------|
| should show loading state | Indicateur de chargement visible |
| should display user information | Nom, email visibles |
| should show admin badge | Admin -> badge Administrateur |
| should show user badge | Régulier -> badge Utilisateur |
| should handle delete account | Delete déclenche logout + redirection |
| should show Member Since | Date affichée |

---

## Tests E2E (27 tests)

### Configuration

**`frontend/cypress.config.ts`:**
- URL de base : `http://localhost:3000`
- Pattern de spec : `cypress/e2e/**/*.cy.ts`
- Viewport : 1280x720
- `allowCypressEnv: false`

**Commandes Personnalisées (`cypress/support/commands.ts`):**
- `cy.login(email, password)` - Login API + configuration localStorage
- `cy.register(firstName, lastName, email, password)` - Inscription API

### Tests Auth (`cypress/e2e/auth.cy.ts`) - 9 tests
| Test | Description |
|------|-------------|
| should display login page | Le formulaire s'affiche correctement |
| should login with valid credentials | Connexion admin réussit |
| should show error with invalid credentials | Mauvais mot de passe affiche une erreur |
| should navigate to register | La navigation par lien fonctionne |
| should display register page | Le formulaire d'inscription s'affiche |
| should register new user | Création d'un nouveau compte |
| should navigate to login from register | La navigation par lien fonctionne |
| should redirect unauthenticated users | Route protégée -> /login |
| should logout | Logout vide la session |

### Tests Session (`cypress/e2e/sessions.cy.ts`) - 10 tests
| Test | Description |
|------|-------------|
| should display sessions list | Cartes visibles avec données |
| should view session details | Page de détail se charge |
| should join a session | Participation réussit |
| should leave a session | Désinscription réussit |
| should not show create button for non-admin | Utilisateur régulier restreint |
| should show create button for admin | Admin voit Create |
| should create a new session | Soumission du formulaire fonctionne |
| should edit a session | Formulaire d'édition + soumission |
| should delete a session | Carte supprimée |
| should show delete button on cards | Admin voit Delete |

### Tests Profile (`cypress/e2e/profile.cy.ts`) - 8 tests
| Test | Description |
|------|-------------|
| should display user information | Nom, email visibles |
| should show User badge for regular users | Texte du badge correct |
| should show Member Since date | Date affichée |
| should navigate back to sessions | Bouton retour fonctionne |
| should show Administrator badge | Badge admin visible |
| should display admin email | Email visible |
| should delete account with confirmation | Flux de suppression de compte |
| should redirect after account deletion | Page de connexion après suppression |

---

## Couverture

### Couverture Backend
Exécutez `cd backend && npm run test:coverage` pour générer le rapport de couverture.

**Cible :** 85%+ sur toutes les métriques

### Couverture Frontend
Exécutez `cd frontend && npm run test:coverage` pour générer le rapport de couverture.

**Cible :** 80%+ sur toutes les métriques

Les rapports de couverture sont générés dans le répertoire `coverage/` de chaque projet.

---

## Architecture de Test

### Stratégie de Test Backend
```
Tests Unitaires (37)
├── Mock Prisma au niveau du module (tests/setup.ts)
├── Tester les services en isolation (logique métier)
├── Tester les middlewares en isolation (auth, validation)
└── Tester les utilitaires en isolation (JWT)

Tests d'Intégration (20)
├── Utiliser supertest contre l'application Express
├── Prisma toujours mocké (pas de vraie DB nécessaire)
├── Tester le cycle complet requête/réponse
└── Vérifier les codes de statut, corps de réponse, gestion d'erreurs
```

### Stratégie de Test Frontend
```
Tests Unitaires (45)
├── Mocker les services avec vi.mock
├── Mocker react-router-dom (useNavigate, useParams)
├── Rendre les composants avec Testing Library
├── Simuler les interactions utilisateur
└── Affirmer l'état du DOM et les appels mockés

Tests E2E (27)
├── Navigateur réel (Cypress)
├── Backend + frontend réels en cours d'exécution
├── cy.login() personnalisé pour configuration auth rapide
├── Tester les parcours utilisateur complets
└── Vérifier l'état de l'UI et la navigation
```

### Patterns de Test Clés Utilisés

**Mocking Prisma (Backend):**
```typescript
// tests/setup.ts
vi.mock('../src/prisma', () => ({
  default: { user: { findUnique: vi.fn(), ... }, ... }
}));
```

**Mocking Service (Frontend):**
```typescript
vi.mock('../../src/services/auth.service', () => ({
  authService: { login: vi.fn(), isAuthenticated: vi.fn(), ... }
}));
```

**Mocking Router (Frontend):**
```typescript
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});
```

**Commandes Personnalisées Cypress:**
```typescript
Cypress.Commands.add('login', (email, password) => {
  cy.request('POST', 'http://localhost:8080/api/auth/login', { email, password })
    .then((response) => {
      window.localStorage.setItem('token', response.body.token);
      window.localStorage.setItem('user', JSON.stringify(response.body));
    });
});
```
