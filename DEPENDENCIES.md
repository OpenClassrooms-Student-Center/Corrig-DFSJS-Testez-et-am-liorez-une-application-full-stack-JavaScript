# Dépendances du Projet

Liste complète de toutes les dépendances utilisées dans l'application Yoga Studio (solution).

## Dépendances Backend

### Dépendances de Production

```json
{
  "@prisma/client": "^5.20.0",        // Client ORM Prisma pour l'accès à la base de données
  "bcrypt": "^5.1.1",                 // Hachage de mots de passe
  "cors": "^2.8.5",                   // Middleware Cross-Origin Resource Sharing
  "dotenv": "^16.4.5",                // Chargeur de variables d'environnement
  "express": "^4.19.2",               // Framework d'application web
  "jsonwebtoken": "^9.0.2",           // Génération/vérification de jetons JWT
  "zod": "^3.23.8"                    // Bibliothèque de validation de schéma
}
```

### Dépendances de Développement

```json
{
  "@types/bcrypt": "^5.0.2",          // Types TypeScript pour bcrypt
  "@types/cors": "^2.8.17",           // Types TypeScript pour cors
  "@types/express": "^4.17.21",       // Types TypeScript pour Express
  "@types/jsonwebtoken": "^9.0.6",    // Types TypeScript pour JWT
  "@types/node": "^22.5.0",           // Types TypeScript pour Node.js
  "@types/supertest": "latest",       // Types TypeScript pour supertest
  "@vitest/coverage-v8": "latest",    // Fournisseur de couverture V8 pour Vitest
  "nodemon": "^3.1.4",                // Redémarrage automatique lors des changements de fichiers
  "prisma": "^5.20.0",                // CLI Prisma pour les migrations
  "supertest": "latest",              // Bibliothèque d'assertion HTTP pour les tests d'intégration
  "ts-node": "^10.9.2",               // Exécution TypeScript pour Node.js
  "typescript": "^5.5.4",             // Compilateur TypeScript
  "vitest": "latest"                  // Framework de test
}
```

## Dépendances Frontend

### Dépendances de Production

```json
{
  "axios": "^1.7.7",                  // Client HTTP pour les appels API
  "react": "^19.0.0",                 // Bibliothèque React
  "react-dom": "^19.0.0",             // Rendu DOM React
  "react-router-dom": "^6.26.2"       // Bibliothèque de routage pour React
}
```

### Dépendances de Développement

```json
{
  "@testing-library/jest-dom": "latest",     // Matchers personnalisés pour les tests DOM
  "@testing-library/react": "latest",        // Utilitaires de test de composants React
  "@testing-library/user-event": "latest",   // Simulation d'interactions utilisateur
  "@types/react": "^19.0.1",                 // Types TypeScript pour React
  "@types/react-dom": "^19.0.1",             // Types TypeScript pour React DOM
  "@vitejs/plugin-react": "^4.3.1",          // Plugin Vite pour React
  "@vitest/coverage-v8": "latest",           // Fournisseur de couverture V8 pour Vitest
  "autoprefixer": "^10.4.20",               // Plugin PostCSS pour les préfixes vendor
  "cypress": "latest",                       // Framework de test E2E
  "jsdom": "latest",                         // Implémentation DOM pour les tests
  "postcss": "^8.4.47",                      // Outil de transformation CSS
  "tailwindcss": "^4.0.0",                  // Framework CSS utilitaire
  "typescript": "^5.5.4",                    // Compilateur TypeScript
  "vite": "^7.0.0",                          // Outil de build et serveur de développement
  "vitest": "latest"                         // Framework de test
}
```

## Infrastructure

### Docker

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16-alpine            # PostgreSQL 16 (Alpine Linux)
```

## Version Node.js

```
Requise : Node.js 22 LTS ou supérieur
```

## Commandes d'Installation des Dépendances

### Installation Complète

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## Résumé des Dépendances de Test

### Tests Backend
| Package | Objectif |
|---------|---------|
| vitest | Exécuteur de tests et bibliothèque d'assertion |
| @vitest/coverage-v8 | Couverture de code avec le moteur V8 |
| supertest | Test des endpoints HTTP |
| @types/supertest | Types TypeScript pour supertest |

### Tests Frontend
| Package | Objectif |
|---------|---------|
| vitest | Exécuteur de tests et bibliothèque d'assertion |
| @vitest/coverage-v8 | Couverture de code avec le moteur V8 |
| jsdom | DOM similaire au navigateur pour les tests |
| @testing-library/react | Rendu de composants React |
| @testing-library/jest-dom | Matchers d'assertion DOM |
| @testing-library/user-event | Simulation d'interactions utilisateur |
| cypress | Tests E2E dans le navigateur |

## Résumé de la Stack Technologique

### Backend
| Technologie | Version | Objectif |
|------------|---------|---------|
| Node.js | 22 LTS | Environnement d'exécution |
| TypeScript | 5.4+ | Langage |
| Express | 4.x | Framework web |
| Prisma | 5.x | ORM |
| PostgreSQL | 16 | Base de données |
| JWT | 9.x | Authentification |
| bcrypt | 5.x | Hachage de mots de passe |
| Zod | 3.x | Validation |
| Vitest | latest | Tests |
| Supertest | latest | Tests HTTP |

### Frontend
| Technologie | Version | Objectif |
|------------|---------|---------|
| React | 19.x | Bibliothèque UI |
| TypeScript | 5.4+ | Langage |
| Vite | 7.x | Outil de build |
| TailwindCSS | 4.0 | Stylisation |
| React Router | 6.x | Routage |
| Axios | 1.x | Client HTTP |
| Vitest | latest | Tests |
| Testing Library | latest | Tests de composants |
| Cypress | latest | Tests E2E |

## Compatibilité

| Package | Node.js | TypeScript |
|---------|---------|------------|
| Express | >=18.0.0 | >=5.0.0 |
| Prisma | >=18.0.0 | >=5.0.0 |
| React | >=18.0.0 | >=5.0.0 |
| Vite | >=18.0.0 | >=5.0.0 |
| Vitest | >=18.0.0 | >=5.0.0 |
| Cypress | >=18.0.0 | >=5.0.0 |

## Commandes Utiles

### Vérifier les Mises à Jour
```bash
npm outdated
```

### Mettre à Jour dans la Plage Semver
```bash
npm update
```

### Auditer les Vulnérabilités
```bash
npm audit
npm audit fix
```

### Régénérer le Client Prisma
```bash
cd backend
npx prisma generate
```

### Réinitialiser la Base de Données
```bash
cd backend
npx prisma migrate reset
npm run prisma:seed
```
