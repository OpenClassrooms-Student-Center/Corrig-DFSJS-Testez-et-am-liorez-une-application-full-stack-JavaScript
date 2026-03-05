# Structure du Projet

Structure complète du projet de solution Yoga Studio.

```
p4-dfsjs-starter/
│
├── README.md                      # Documentation complète du projet
├── MANIFEST.md                    # Manifeste et aperçu du projet
├── PROJECT_STRUCTURE.md           # Ce fichier
├── ANTI-PATTERNS.md               # Anti-patterns corrigés
├── TESTING_GUIDE.md               # Documentation des tests
├── VERIFICATION.md                # Liste de vérification
├── DEPENDENCIES.md                # Liste complète des dépendances
├── .gitignore                     # Règles d'exclusion Git
├── docker-compose.yml             # Configuration du conteneur PostgreSQL
│
├── backend/                       # Backend Node.js/Express/TypeScript
│   ├── package.json               # Dépendances backend
│   ├── tsconfig.json              # Configuration TypeScript (mode strict)
│   ├── nodemon.json               # Configuration Nodemon pour le dev
│   ├── vitest.config.ts           # Configuration des tests Vitest
│   ├── .env                       # Variables d'environnement (pré-configuré)
│   ├── .env.example               # Modèle de variables d'environnement
│   │
│   ├── prisma/
│   │   ├── schema.prisma          # Schéma de base de données (PostgreSQL)
│   │   └── seed.ts                # Script de peuplement de la base
│   │
│   ├── src/
│   │   ├── app.ts                 # Point d'entrée Express + middleware d'erreurs
│   │   ├── prisma.ts              # Instance singleton PrismaClient
│   │   │
│   │   ├── types/
│   │   │   └── index.ts           # JwtPayload, AuthRequest, DTOs de réponse
│   │   │
│   │   ├── errors/
│   │   │   └── app-error.ts       # AppError, NotFoundError, UnauthorizedError, etc.
│   │   │
│   │   ├── controllers/           # Wrappers minces request/response
│   │   │   ├── auth.controller.ts      # Login, Register
│   │   │   ├── session.controller.ts   # CRUD + participer/annuler participation
│   │   │   ├── teacher.controller.ts   # Lister et obtenir les professeurs
│   │   │   └── user.controller.ts      # Obtenir utilisateur, supprimer compte
│   │   │
│   │   ├── services/              # Couche de logique métier
│   │   │   ├── auth.service.ts         # Vérification login, inscription
│   │   │   ├── session.service.ts      # CRUD, participation, vérifications admin
│   │   │   ├── teacher.service.ts      # Récupération des professeurs
│   │   │   └── user.service.ts         # Profil, suppression, promotion admin
│   │   │
│   │   ├── repositories/          # Couche d'accès aux données
│   │   │   ├── user.repository.ts      # Opérations CRUD utilisateur
│   │   │   ├── teacher.repository.ts   # Requêtes professeur
│   │   │   ├── session.repository.ts   # CRUD session avec includes
│   │   │   └── participation.repository.ts  # Opérations rejoindre/quitter
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts       # Vérification JWT (typé)
│   │   │   ├── error.middleware.ts      # Gestionnaire d'erreurs global
│   │   │   ├── async-handler.ts        # Wrapper async (élimine try/catch)
│   │   │   └── validate.middleware.ts  # Validation body + params Zod
│   │   │
│   │   ├── dto/                   # Schémas de validation Zod
│   │   │   ├── auth.dto.ts             # Login, Register, IdParamSchema
│   │   │   └── session.dto.ts          # Create/Update, ParticipationParamSchema
│   │   │
│   │   ├── utils/
│   │   │   └── jwt.util.ts             # Génération/vérification JWT (typé)
│   │   │
│   │   └── routes/
│   │       └── index.ts                # Routes avec asyncHandler + validate
│   │
│   └── tests/
│       ├── setup.ts                    # Mock Prisma global
│       ├── unit/
│       │   ├── utils/
│       │   │   └── jwt.util.test.ts
│       │   ├── middleware/
│       │   │   └── auth.middleware.test.ts
│       │   └── services/
│       │       ├── auth.service.test.ts
│       │       ├── session.service.test.ts
│       │       ├── teacher.service.test.ts
│       │       └── user.service.test.ts
│       └── integration/
│           ├── auth.routes.test.ts
│           ├── session.routes.test.ts
│           ├── teacher.routes.test.ts
│           └── user.routes.test.ts
│
└── frontend/                      # Frontend React/TypeScript/Vite
    ├── package.json               # Dépendances frontend
    ├── tsconfig.json              # Configuration TypeScript (mode strict)
    ├── tsconfig.node.json         # Configuration TypeScript pour Vite
    ├── vite.config.ts             # Configuration Vite + config tests
    ├── tailwind.config.js         # Configuration TailwindCSS
    ├── index.html                 # Point d'entrée HTML
    ├── cypress.config.ts          # Configuration E2E Cypress
    │
    ├── src/
    │   ├── main.tsx               # Point d'entrée React
    │   ├── App.tsx                # Composant App avec routage
    │   ├── index.css              # Styles globaux avec imports Tailwind
    │   ├── vite-env.d.ts          # Déclarations de types Vite
    │   │
    │   ├── components/
    │   │   ├── Navbar.tsx         # Barre de navigation (typée)
    │   │   └── ProtectedRoute.tsx # Wrapper de route protégée par auth
    │   │
    │   ├── hooks/
    │   │   └── useAuth.ts         # Hook d'état d'authentification
    │   │
    │   ├── pages/
    │   │   ├── Login.tsx          # Page de connexion (typée, AbortController)
    │   │   ├── Register.tsx       # Page d'inscription (typée, AbortController)
    │   │   ├── Sessions.tsx       # Liste des sessions (typée, AbortController)
    │   │   ├── SessionDetail.tsx  # Détail de session (typé, AbortController)
    │   │   ├── SessionForm.tsx    # Formulaire Create/Edit (typé, AbortController)
    │   │   └── Profile.tsx        # Profil utilisateur (typé, AbortController)
    │   │
    │   ├── services/
    │   │   ├── api.ts             # Instance Axios + intercepteur de requêtes
    │   │   ├── auth.service.ts    # Service d'authentification (typé)
    │   │   ├── session.service.ts # Appels API session (avec AbortSignal)
    │   │   ├── teacher.service.ts # Appels API professeur (avec AbortSignal)
    │   │   └── user.service.ts    # Appels API utilisateur
    │   │
    │   └── types/
    │       └── index.ts           # Types TypeScript + ApiError
    │
    ├── tests/
    │   ├── setup.ts               # jest-dom + mock localStorage
    │   ├── hooks/
    │   │   └── useAuth.test.ts
    │   ├── services/
    │   │   └── auth.service.test.ts
    │   ├── components/
    │   │   ├── Navbar.test.tsx
    │   │   └── ProtectedRoute.test.tsx
    │   └── pages/
    │       ├── Login.test.tsx
    │       ├── Register.test.tsx
    │       ├── Sessions.test.tsx
    │       ├── SessionDetail.test.tsx
    │       └── Profile.test.tsx
    │
    └── cypress/
        ├── tsconfig.json          # Configuration TypeScript Cypress
        ├── support/
        │   ├── e2e.ts             # Fichier de support
        │   └── commands.ts        # Commandes personnalisées (cy.login, cy.register)
        └── e2e/
            ├── auth.cy.ts         # Tests E2E d'authentification
            ├── sessions.cy.ts     # Tests E2E de gestion des sessions
            └── profile.cy.ts      # Tests E2E de profil
```

## Résumé du Nombre de Fichiers

### Backend (41 fichiers)
- **Source :** 24 fichiers (app, prisma, types, errors, controllers, services, repositories, middleware, dto, utils, routes)
- **Tests :** 11 fichiers (setup + 6 unitaires + 4 intégration)
- **Config :** 4 fichiers (package.json, tsconfig, nodemon, vitest.config)
- **Prisma :** 2 fichiers (schema, seed)

### Frontend (33 fichiers)
- **Source :** 18 fichiers (app, pages, components, hooks, services, types)
- **Tests :** 10 fichiers (setup + 9 fichiers de test)
- **Cypress :** 6 fichiers (config, tsconfig, support, specs)
- **Config :** 6 fichiers (package.json, tsconfig, vite, tailwind, index.html)

### Niveau Racine (8+ fichiers)
- Documentation : 7 fichiers markdown
- Config : docker-compose.yml, .gitignore

**Total :** ~83 fichiers source (hors node_modules, dist, coverage)

## Décisions d'Architecture Clés

### Backend : Architecture en Couches

```
Controller → Service → Repository → Prisma → Database
```

- **Controllers** extraient les données de requête, appellent les services, retournent les réponses (~5 lignes par méthode)
- **Services** contiennent toute la logique métier (vérifications auth, validation, levée d'erreurs)
- **Repositories** encapsulent les appels Prisma avec les includes appropriés
- **Middleware** gère les préoccupations transversales (auth, validation, erreurs, wrapping async)

### Frontend : Pattern Service + Hook

```
Page → Module Service → Axios (avec intercepteur) → API
Page → Hook useAuth → Service Auth → localStorage
```

- **Modules de service** encapsulent les appels API avec typage approprié et support AbortSignal
- **Hook useAuth** centralise la gestion de l'état d'authentification
- **Intercepteur Axios** attache automatiquement les tokens JWT
- **ProtectedRoute** protège les routes authentifiées
- **AbortController** prévient les fuites mémoire au démontage

## Schéma de Base de Données

### Modèles
- **User** (7 champs) - id, email, firstName, lastName, password, admin, timestamps
- **Teacher** (4 champs) - id, firstName, lastName, timestamps
- **Session** (7 champs) - id, name, date, description, teacherId, timestamps
- **SessionParticipation** (2 champs) - sessionId, userId (clé composite)

### Relations
- User <-> SessionParticipation (un-à-plusieurs)
- Teacher <-> Session (un-à-plusieurs)
- Session <-> SessionParticipation (un-à-plusieurs)

## Routage

### Routes API Backend
| Méthode | Chemin | Auth | Admin | Validation |
|--------|------|------|-------|------------|
| POST | `/api/auth/register` | Non | Non | RegisterSchema |
| POST | `/api/auth/login` | Non | Non | LoginSchema |
| GET | `/api/session` | Oui | Non | - |
| GET | `/api/session/:id` | Oui | Non | IdParamSchema |
| POST | `/api/session` | Oui | Oui | CreateSessionSchema |
| PUT | `/api/session/:id` | Oui | Oui | IdParamSchema + UpdateSessionSchema |
| DELETE | `/api/session/:id` | Oui | Oui | IdParamSchema |
| POST | `/api/session/:id/participate/:userId` | Oui | Non | ParticipationParamSchema |
| DELETE | `/api/session/:id/participate/:userId` | Oui | Non | ParticipationParamSchema |
| GET | `/api/teacher` | Oui | Non | - |
| GET | `/api/teacher/:id` | Oui | Non | IdParamSchema |
| GET | `/api/user/:id` | Oui | Non | IdParamSchema |
| DELETE | `/api/user/:id` | Oui | Non | IdParamSchema |

### Routes Frontend
| Chemin | Composant | Auth Requise |
|------|-----------|---------------|
| `/` | Redirection vers `/sessions` | Non |
| `/login` | Login | Non |
| `/register` | Register | Non |
| `/sessions` | Sessions | Oui |
| `/sessions/:id` | SessionDetail | Oui |
| `/sessions/create` | SessionForm | Oui |
| `/sessions/edit/:id` | SessionForm | Oui |
| `/profile` | Profile | Oui |

## Flux de Gestion des Erreurs

```
1. Le gestionnaire de route lève une AppError (ou sous-classe)
   └── asyncHandler l'attrape
       └── Passe à next(error)
           └── errorMiddleware le gère :
               ├── AppError → { message, statusCode }
               ├── ZodError → { message: formaté, 400 }
               ├── PrismaError P2002 → { message: "existe déjà", 409 }
               ├── PrismaError P2025 → { message: "non trouvé", 404 }
               └── Inconnu → { message: "Erreur interne du serveur", 500 }
```

## Données de Peuplement

### Utilisateurs
| Email | Mot de passe | Rôle |
|-------|----------|------|
| yoga@studio.com | test!1234 | Admin |
| user@test.com | test!1234 | Régulier |

### Professeurs
1. Margot Delahaye
2. Helene Thiercelin
3. David Martin

### Sessions
1. Yoga Vinyasa (Professeur : Margot, Date : 2026-02-15)
2. Yoga Hatha (Professeur : Helene, Date : 2026-02-20)
3. Yoga Ashtanga (Professeur : Margot, Date : 2026-02-25)
4. Yin Yoga (Professeur : David, Date : 2026-03-01)
