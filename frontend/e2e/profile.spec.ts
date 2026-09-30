import { test, expect } from '@playwright/test';
import { acceptConfirmDialogs, login } from './helpers';

test.describe('Profile', () => {
  test.describe('As regular user', () => {
    test.beforeEach(async ({ page }) => {
      await login(page, 'user@test.com', 'test!1234');
    });

    test('should display user information', async ({ page }) => {
      await page.goto('/profile');
      await expect(page.getByRole('heading', { name: 'My Profile' })).toBeVisible();
      await expect(page.getByText('First Name')).toBeVisible();
      await expect(page.getByText('Last Name')).toBeVisible();
      await expect(page.getByText('Email', { exact: true })).toBeVisible();
      await expect(page.getByText('user@test.com')).toBeVisible();
    });

    test('should show User badge for regular users', async ({ page }) => {
      await page.goto('/profile');
      await expect(page.getByText('User', { exact: true })).toBeVisible();
    });

    test('should show Member Since date', async ({ page }) => {
      await page.goto('/profile');
      await expect(page.getByText('Member Since')).toBeVisible();
    });

    test('should navigate back to sessions', async ({ page }) => {
      await page.goto('/profile');
      await page.getByRole('button', { name: 'Back to Sessions' }).click();
      await expect(page).toHaveURL(/\/sessions/);
    });
  });

  test.describe('As admin user', () => {
    test.beforeEach(async ({ page }) => {
      await login(page, 'yoga@studio.com', 'test!1234');
    });

    test('should show Administrator badge', async ({ page }) => {
      await page.goto('/profile');
      await expect(page.getByText('Administrator')).toBeVisible();
    });

    test('should display admin email', async ({ page }) => {
      await page.goto('/profile');
      await expect(page.getByText('yoga@studio.com')).toBeVisible();
    });
  });

  test.describe('Account deletion', () => {
    test('should delete account with confirmation', async ({ page }) => {
      // Register a temporary user to delete
      acceptConfirmDialogs(page);
      const uniqueEmail = `delete-${Date.now()}@test.com`;
      await page.goto('/register');
      await page.getByLabel('First Name').fill('Delete');
      await page.getByLabel('Last Name').fill('Me');
      await page.getByLabel('Email').fill(uniqueEmail);
      await page.getByLabel('Password').fill('password123');
      await page.getByRole('button', { name: 'Register' }).click();
      await expect(page).toHaveURL(/\/sessions/);

      await page.goto('/profile');
      const deleteButton = page.getByRole('button', { name: 'Delete Account' });
      await expect(deleteButton).toBeVisible();
      await deleteButton.click();
      await expect(page).toHaveURL(/\/login/);
    });

    test('should redirect to login after account deletion', async ({ page }) => {
      acceptConfirmDialogs(page);
      const uniqueEmail = `delete2-${Date.now()}@test.com`;
      await page.goto('/register');
      await page.getByLabel('First Name').fill('Delete');
      await page.getByLabel('Last Name').fill('Me');
      await page.getByLabel('Email').fill(uniqueEmail);
      await page.getByLabel('Password').fill('password123');
      await page.getByRole('button', { name: 'Register' }).click();
      await expect(page).toHaveURL(/\/sessions/);

      await page.goto('/profile');
      await page.getByRole('button', { name: 'Delete Account' }).click();
      await expect(page).toHaveURL(/\/login/);
      // Should not be able to access protected routes
      await page.goto('/sessions');
      await expect(page).toHaveURL(/\/login/);
    });
  });
});
