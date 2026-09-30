import type { Page } from '@playwright/test';

const API_URL = 'http://localhost:8080/api';

interface AuthResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  admin: boolean;
  token: string;
}

/**
 * Injecte la session dans le localStorage avant chaque navigation de la page,
 * exactement comme le fait authService apres un login reussi.
 */
const seedSession = async (page: Page, auth: AuthResponse): Promise<void> => {
  await page.addInitScript(
    ({ token, user }) => {
      window.localStorage.setItem('token', token);
      window.localStorage.setItem('user', user);
    },
    { token: auth.token, user: JSON.stringify(auth) }
  );
};

/** Equivalent de l'ancienne commande Cypress `cy.login()`. */
export const login = async (page: Page, email: string, password: string): Promise<AuthResponse> => {
  const response = await page.request.post(`${API_URL}/auth/login`, {
    data: { email, password },
  });

  if (!response.ok()) {
    throw new Error(`Login failed for ${email} (HTTP ${response.status()})`);
  }

  const auth = (await response.json()) as AuthResponse;
  await seedSession(page, auth);
  return auth;
};

/** Equivalent de l'ancienne commande Cypress `cy.register()`. */
export const register = async (
  page: Page,
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await page.request.post(`${API_URL}/auth/register`, {
    data: { firstName, lastName, email, password },
  });

  if (!response.ok()) {
    throw new Error(`Registration failed for ${email} (HTTP ${response.status()})`);
  }

  const auth = (await response.json()) as AuthResponse;
  await seedSession(page, auth);
  return auth;
};

/** Accepte automatiquement les window.confirm() (Playwright les refuse par defaut). */
export const acceptConfirmDialogs = (page: Page): void => {
  page.on('dialog', (dialog) => dialog.accept());
};
