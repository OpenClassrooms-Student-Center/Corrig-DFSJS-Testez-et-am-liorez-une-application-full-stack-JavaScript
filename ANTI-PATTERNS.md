# Anti-Patterns Corrigés

Ce document liste les 27 anti-patterns qui étaient présents dans le code de démarrage, ainsi que les corrections appliquées.

## Anti-Patterns Backend (15)

### 1. Blocs Try/Catch Répétitifs
**Emplacement :** Les 4 contrôleurs (auth, session, teacher, user)

**Problème :** Chaque méthode de contrôleur avait son propre bloc try/catch avec une gestion d'erreur identique, conduisant à une duplication de code massive (13 blocs try/catch au total).

**Avant :**
```typescript
async login(req: Request, res: Response) {
  try {
    // ... logic
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
```

**Correction :** Création d'un wrapper `asyncHandler()` dans `middleware/async-handler.ts` et `errorMiddleware` dans `middleware/error.middleware.ts`. Tous les gestionnaires de routes sont enveloppés avec `asyncHandler()` dans `routes/index.ts`, et les erreurs sont gérées de manière centralisée.

---

### 2. Contrôleurs Appelant Prisma Directement
**Emplacement :** Les 4 contrôleurs

**Problème :** Les contrôleurs importaient et utilisaient `PrismaClient` directement, mélangeant l'accès aux données avec la gestion des requêtes.

**Avant :**
```typescript
const prisma = new PrismaClient();

async login(req: Request, res: Response) {
  const user = await prisma.user.findUnique({ where: { email } });
}
```

**Correction :** Création d'une couche repository (`repositories/*.ts`) pour l'accès aux données et d'une couche service (`services/*.ts`) pour la logique métier. Les contrôleurs appellent désormais uniquement les services.

---

### 3. Multiples Instances PrismaClient
**Emplacement :** Les 4 contrôleurs (chacun avait `new PrismaClient()`)

**Problème :** 4 instances PrismaClient séparées étaient créées, gaspillant des connexions et brisant la cohérence transactionnelle.

**Correction :** Création de `src/prisma.ts` avec une seule instance partagée importée par tous les repositories.

---

### 4. Logique Métier dans les Contrôleurs
**Emplacement :** Tous les contrôleurs

**Problème :** Les contrôleurs contenaient la comparaison de mots de passe, les vérifications admin, la vérification des emails en double, les vérifications d'existence de participation, etc.

**Correction :** Toute la logique métier déplacée vers la couche service :
- `auth.service.ts` - vérification du mot de passe, génération de token, vérifications de doublons
- `session.service.ts` - autorisation admin, existence d'enseignant, conflits de participation
- `user.service.ts` - vérification d'auto-suppression, garde de promotion admin

---

### 5. Validations Manuelles avec if/else
**Emplacement :** Tous les contrôleurs

**Problème :** Validation manuelle avec des instructions if/else verbeuses au lieu d'utiliser les schémas Zod existants.

**Avant :**
```typescript
if (!email) return res.status(400).json({ message: 'Email is required' });
if (!password) return res.status(400).json({ message: 'Password is required' });
```

**Correction :** Création de middleware `validate()` et `validateParams()` dans `middleware/validate.middleware.ts` qui utilise les schémas Zod de `dto/*.ts`. Appliqué dans les routes :
```typescript
router.post('/api/auth/login', validate(LoginSchema), asyncHandler(authController.login));
```

---

### 6. Utilisation Extensive du Type `any`
**Emplacement :** Dans tous les contrôleurs et utilitaires

**Problème :** Les fonctions retournaient `any`, les captures d'erreur utilisaient `any`, les objets de réponse étaient typés comme `any`.

**Correction :** Création de `types/index.ts` avec des interfaces appropriées : `JwtPayload`, `AuthRequest`, `UserResponse`, `AuthResponseDto`, `SessionResponse`, `TeacherResponse`, `MessageResponse`. Tous les types `any` éliminés.

---

### 7. Pas de Middleware de Gestion d'Erreurs Global
**Emplacement :** `app.ts`

**Problème :** Pas de gestionnaire d'erreurs centralisé. Chaque contrôleur gérait ses propres erreurs de manière incohérente.

**Correction :** Création de `middleware/error.middleware.ts` qui gère :
- Les sous-classes `AppError` (retourne le code de statut approprié + message)
- `ZodError` (retourne 400 avec les erreurs de validation formatées)
- Prisma `P2002` (retourne 409 conflict)
- Prisma `P2025` (retourne 404 not found)
- Les erreurs inconnues (retourne 500)

Enregistré dans `app.ts` après les routes : `app.use(errorMiddleware)`

---

### 8. Pas de Classes d'Erreur Personnalisées
**Emplacement :** Les contrôleurs utilisaient inline `res.status(xxx).json({ message: '...' })`

**Problème :** Les réponses d'erreur étaient des chaînes ad-hoc sans sécurité de type ni cohérence.

**Correction :** Création de `errors/app-error.ts` avec une hiérarchie d'erreurs :
- `AppError` (base, n'importe quel code de statut)
- `NotFoundError` (404)
- `UnauthorizedError` (401)
- `ForbiddenError` (403)
- `ConflictError` (409)
- `ValidationError` (400)

Les services lancent ces erreurs, et le gestionnaire global les capture.

---

### 9. Middleware Auth Utilisant res.json() pour les Erreurs
**Emplacement :** `middleware/auth.middleware.ts`

**Problème :** Le middleware d'authentification envoyait des réponses directement, contournant le pipeline de gestion des erreurs.

**Avant :**
```typescript
return res.status(401).json({ message: 'No token provided' });
```

**Correction :** Le middleware d'authentification lance désormais `UnauthorizedError`, qui est capturé par `asyncHandler` et géré par `errorMiddleware`.

---

### 10. Interface AuthRequest Inline
**Emplacement :** `middleware/auth.middleware.ts`

**Problème :** L'interface `AuthRequest` était définie inline dans le fichier middleware, non réutilisable ailleurs.

**Correction :** Déplacée vers `types/index.ts` et importée là où nécessaire (middleware, contrôleurs, services).

---

### 11. jwt.util Retournant `any`
**Emplacement :** `utils/jwt.util.ts`

**Problème :** `verifyToken()` retournait `any` depuis `jwt.verify()`.

**Correction :** Type de retour changé en `JwtPayload | null` avec un cast de type approprié.

---

### 12. Pas de Wrapper Async Handler
**Emplacement :** Toutes les définitions de routes

**Problème :** Chaque gestionnaire de route asynchrone nécessitait son propre try/catch pour éviter les rejets de promesses non gérés.

**Correction :** Création de `asyncHandler(fn)` dans `middleware/async-handler.ts` qui enveloppe n'importe quel gestionnaire et transmet les erreurs à `next()`. Appliqué à toutes les routes dans `routes/index.ts`.

---

### 13. Pas de Validation pour les Paramètres de Route
**Emplacement :** Routes avec paramètres `:id` et `:userId`

**Problème :** Les paramètres de route n'étaient pas validés - des IDs invalides (chaînes, nombres négatifs) étaient passés directement à Prisma.

**Correction :** Ajout de `IdParamSchema` dans `dto/auth.dto.ts` et `ParticipationParamSchema` dans `dto/session.dto.ts`. Appliqué via le middleware `validateParams()` dans les routes.

---

### 14. Pas de Couche Service
**Emplacement :** Tout le backend

**Problème :** Pas de séparation entre la gestion des requêtes et la logique métier. Les contrôleurs faisaient tout.

**Correction :** Création de 4 fichiers service :
- `services/auth.service.ts` - login, register
- `services/session.service.ts` - getAll, getById, create, update, delete, participate, unparticipate
- `services/teacher.service.ts` - getAll, getById
- `services/user.service.ts` - getById, delete, promoteSelfToAdmin

---

### 15. Pas de Couche Repository
**Emplacement :** Tout le backend

**Problème :** Les appels Prisma étaient dispersés dans les contrôleurs avec des includes et requêtes incohérents.

**Correction :** Création de 4 fichiers repository avec des patterns de requête cohérents :
- `repositories/user.repository.ts`
- `repositories/teacher.repository.ts`
- `repositories/session.repository.ts` (avec teacher + participants.user includes)
- `repositories/participation.repository.ts`

---

## Anti-Patterns Frontend (12)

### 1. useEffect Sans Nettoyage
**Emplacement :** Les 6 pages qui récupèrent des données

**Problème :** Pas d'AbortController pour annuler les requêtes au démontage, causant des fuites de mémoire potentielles et des conditions de course.

**Avant :**
```typescript
useEffect(() => {
  fetchSessions();
}, []);
```

**Correction :** Ajout d'AbortController avec signal passé aux appels de service :
```typescript
useEffect(() => {
  const controller = new AbortController();
  const fetchData = async () => {
    const data = await sessionService.getAll(controller.signal);
    setSessions(data);
  };
  fetchData();
  return () => controller.abort();
}, []);
```

---

### 2. Props Typés avec `any`
**Emplacement :** `Navbar.tsx`, `App.tsx` (PrivateRoute)

**Problème :** Les props de composant utilisaient le type `any`.

**Avant :**
```typescript
function Navbar(props: any) { ... }
function PrivateRoute({ children }: any) { ... }
```

**Correction :** Suppression du `props: any` inutilisé de Navbar. Création de `ProtectedRoute.tsx` avec des props typés :
```typescript
interface ProtectedRouteProps { children: ReactNode; }
```

---

### 3. Types de Retour de Fonction Non Spécifiés
**Emplacement :** Tous les composants et fonctions de service

**Problème :** Les fonctions asynchrones retournaient `Promise<any>`, les gestionnaires d'événements typés comme `any`.

**Correction :** Toutes les fonctions correctement typées :
- Gestionnaires d'événements : `FormEvent<HTMLFormElement>`, `ChangeEvent<HTMLInputElement>`
- Opérations asynchrones : `Promise<void>`
- Composants : type de retour `ReactNode`
- Méthodes de service : `Promise<Session[]>`, `Promise<AuthResponse>`, etc.

---

### 4. Rendu Conditionnel Verbeux
**Emplacement :** Tous les composants

**Problème :** Utilisation d'opérateurs ternaires avec null : `{condition ? <Component /> : null}`

**Correction :** Changement vers le pattern `&&` là où approprié : `{condition && <Component />}`

---

### 5. Variables d'État Typées avec `any`
**Emplacement :** Les 6 pages

**Problème :** État explicitement typé avec `any`.

**Avant :**
```typescript
const [sessions, setSessions] = useState<any>([]);
const [loading, setLoading] = useState<any>(true);
const [error, setError] = useState<any>('');
```

**Correction :** Types appropriés :
```typescript
const [sessions, setSessions] = useState<Session[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const [session, setSession] = useState<Session | null>(null);
```

---

### 6. Pas d'Intercepteur de Requête Axios
**Emplacement :** `services/api.ts` + toutes les pages

**Problème :** Chaque appel API ajoutait manuellement l'en-tête `Authorization: Bearer ${token}`.

**Correction :** Ajout d'un intercepteur de requête dans `services/api.ts` :
```typescript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```
Suppression de tous les en-têtes Authorization manuels des pages.

---

### 7. Pas de Modules de Service pour les Appels API
**Emplacement :** Toutes les pages appelaient `api.get/post/put/delete` directement

**Problème :** Appels API dispersés dans les pages avec des URLs dupliquées et une gestion de réponse répétée.

**Correction :** Création de modules de service dédiés :
- `services/session.service.ts` - getAll, getById, create, update, delete, participate, unparticipate
- `services/teacher.service.ts` - getAll, getById
- `services/user.service.ts` - getById, delete, promoteSelfToAdmin

Tous avec des types de retour TypeScript appropriés et support AbortSignal.

---

### 8. Pas de Hooks Personnalisés
**Emplacement :** Logique d'authentification dispersée dans plusieurs composants

**Problème :** Vérification de l'état d'authentification dupliquée dans Navbar, pages, et ProtectedRoute.

**Correction :** Création de `hooks/useAuth.ts` :
```typescript
export function useAuth() {
  return { user, isAuthenticated, isAdmin, login, register, logout };
}
```

---

### 9. Gestionnaires d'Événements Typés comme `any`
**Emplacement :** Toutes les pages de formulaire

**Problème :** Les gestionnaires d'événements utilisaient le type de paramètre `(e: any)`.

**Avant :**
```typescript
const handleSubmit = async (e: any) => { ... }
const handleChange = (e: any) => { ... }
```

**Correction :** Types d'événements appropriés :
```typescript
const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => { ... }
```
Les changements d'input utilisent des setters d'état directs ou des événements de changement typés.

---

### 10. Captures d'Erreur Utilisant `any`
**Emplacement :** Toutes les pages avec des appels API

**Problème :** `catch (err: any)` avec `err.response.data.message` sans sécurité de type.

**Correction :** Ajout de l'interface `ApiError` à `types/index.ts` et utilisation du cast `AxiosError<ApiError>` :
```typescript
catch (err) {
  const axiosError = err as AxiosError<ApiError>;
  setError(axiosError.response?.data?.message || 'An error occurred');
}
```

---

### 11. Composant PrivateRoute Inline
**Emplacement :** `App.tsx`

**Problème :** Garde de route défini inline comme `function PrivateRoute({ children }: any)` à l'intérieur de App.tsx.

**Correction :** Création d'un composant dédié `components/ProtectedRoute.tsx` avec typage approprié et importé dans App.tsx.

---

### 12. En-têtes d'Autorisation Manuels
**Emplacement :** Toutes les pages

**Problème :** Chaque page récupérait manuellement le token et définissait l'en-tête Authorization à chaque requête.

**Avant :**
```typescript
const token = localStorage.getItem('token');
const response = await api.get('/session', {
  headers: { Authorization: `Bearer ${token}` }
});
```

**Correction :** Géré par l'intercepteur de requête Axios (voir correction #6). Les pages appellent simplement les méthodes de service sans se soucier des en-têtes.

---

## Résumé

| Zone | Anti-Patterns | Statut |
|------|--------------|--------|
| Backend | 15 | Tous corrigés |
| Frontend | 12 | Tous corrigés |
| **Total** | **27** | **Tous corrigés** |

### Patterns Clés Introduits
- **Backend :** Controller -> Service -> Repository -> Prisma (architecture en couches)
- **Backend :** asyncHandler + errorMiddleware (gestion d'erreurs centralisée)
- **Backend :** validate() / validateParams() (middleware Zod)
- **Backend :** PrismaClient Singleton
- **Backend :** Hiérarchie d'erreurs personnalisées (sous-classes AppError)
- **Frontend :** Intercepteur de requête Axios (token Bearer automatique)
- **Frontend :** Modules de service dédiés avec AbortSignal
- **Frontend :** Hook personnalisé useAuth
- **Frontend :** Composant ProtectedRoute
- **Frontend :** Nettoyage AbortController dans tous les hooks useEffect
- **Frontend :** Typage TypeScript approprié partout (zéro `any`)
