import { test, expect } from '@playwright/test';
import { login } from './helpers';

// Playwright isole chaque test dans un contexte neuf : pas besoin de vider le
// localStorage manuellement comme le faisait cy.clearLocalStorage().

test.describe('Authentication', () => {
  test.describe('Login Page', () => {
    test('should display login form', async ({ page }) => {
      await page.goto('/login');
      await expect(page.getByRole('heading', { name: 'Login to Yoga Studio' })).toBeVisible();
      await expect(page.getByLabel('Email')).toBeVisible();
      await expect(page.getByLabel('Password')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    });

    test('should login with valid credentials', async ({ page }) => {
      await page.goto('/login');
      await page.getByLabel('Email').fill('yoga@studio.com');
      await page.getByLabel('Password').fill('test!1234');
      await page.getByRole('button', { name: 'Login' }).click();
      await expect(page).toHaveURL(/\/sessions/);
      await expect(page.getByRole('heading', { name: 'Yoga Sessions' })).toBeVisible();
    });

    test('should show error with invalid credentials', async ({ page }) => {
      await page.goto('/login');
      await page.getByLabel('Email').fill('wrong@test.com');
      await page.getByLabel('Password').fill('wrongpassword');
      await page.getByRole('button', { name: 'Login' }).click();
      await expect(page.getByText('Invalid credentials')).toBeVisible();
    });

    test('should navigate to register page', async ({ page }) => {
      await page.goto('/login');
      await page.getByRole('link', { name: 'Register here' }).click();
      await expect(page).toHaveURL(/\/register/);
    });
  });

  test.describe('Register Page', () => {
    test('should display registration form', async ({ page }) => {
      await page.goto('/register');
      await expect(page.getByRole('heading', { name: 'Register for Yoga Studio' })).toBeVisible();
      await expect(page.getByLabel('First Name')).toBeVisible();
      await expect(page.getByLabel('Last Name')).toBeVisible();
      await expect(page.getByLabel('Email')).toBeVisible();
      await expect(page.getByLabel('Password')).toBeVisible();
    });

    test('should register a new user', async ({ page }) => {
      const uniqueEmail = `test-${Date.now()}@test.com`;
      await page.goto('/register');
      await page.getByLabel('First Name').fill('Test');
      await page.getByLabel('Last Name').fill('User');
      await page.getByLabel('Email').fill(uniqueEmail);
      await page.getByLabel('Password').fill('password123');
      await page.getByRole('button', { name: 'Register' }).click();
      await expect(page).toHaveURL(/\/sessions/);
    });

    test('should navigate to login page', async ({ page }) => {
      await page.goto('/register');
      await page.getByRole('link', { name: 'Login here' }).click();
      await expect(page).toHaveURL(/\/login/);
    });
  });

  test.describe('Authentication flow', () => {
    test('should redirect unauthenticated users to login', async ({ page }) => {
      await page.goto('/sessions');
      await expect(page).toHaveURL(/\/login/);
    });

    test('should logout successfully', async ({ page }) => {
      await login(page, 'yoga@studio.com', 'test!1234');
      await page.goto('/sessions');
      await page.getByRole('button', { name: 'Logout' }).click();
      await expect(page).toHaveURL(/\/login/);
    });
  });
});
