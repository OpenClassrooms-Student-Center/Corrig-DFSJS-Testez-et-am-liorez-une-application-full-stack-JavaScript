import { test, expect } from '@playwright/test';
import { acceptConfirmDialogs, login } from './helpers';

test.describe('Sessions', () => {
  test.describe('As regular user', () => {
    test.beforeEach(async ({ page }) => {
      await login(page, 'user@test.com', 'test!1234');
    });

    test('should display sessions list', async ({ page }) => {
      await page.goto('/sessions');
      await expect(page.getByRole('heading', { name: 'Yoga Sessions' })).toBeVisible();
      expect(await page.locator('.grid > div').count()).toBeGreaterThan(0);
    });

    test('should view session details', async ({ page }) => {
      await page.goto('/sessions');
      await page.getByRole('link', { name: 'View Details' }).first().click();
      await expect(page.getByRole('heading', { name: 'Details' })).toBeVisible();
      await expect(page.getByText('Teacher:', { exact: true })).toBeVisible();
      await expect(page.getByText('Participants:', { exact: true })).toBeVisible();
    });

    test('should join a session', async ({ page }) => {
      await page.goto('/sessions');
      await page.getByRole('link', { name: 'View Details' }).first().click();
      const joinButton = page.getByRole('button', { name: 'Join Session' });
      await expect(joinButton).toBeVisible();
      await joinButton.click();
      await expect(page.getByRole('button', { name: 'Leave Session' })).toBeVisible();
    });

    test('should leave a session', async ({ page }) => {
      await page.goto('/sessions');
      await page.getByRole('link', { name: 'View Details' }).first().click();
      await expect(page.getByRole('heading', { name: 'Details' })).toBeVisible();

      const joinButton = page.getByRole('button', { name: 'Join Session' });
      const leaveButton = page.getByRole('button', { name: 'Leave Session' });

      // Ensure we're participating first
      if (await joinButton.isVisible()) {
        await joinButton.click();
        await expect(leaveButton).toBeVisible();
      }

      await leaveButton.click();
      await expect(joinButton).toBeVisible();
    });

    test('should not show create session button for non-admin', async ({ page }) => {
      await page.goto('/sessions');
      await expect(page.getByRole('heading', { name: 'Yoga Sessions' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Create Session' })).toHaveCount(0);
    });
  });

  test.describe('As admin user', () => {
    // create -> edit -> delete : ces scenarios s'enchainent sur la meme session.
    test.describe.configure({ mode: 'serial' });

    test.beforeEach(async ({ page }) => {
      await login(page, 'yoga@studio.com', 'test!1234');
    });

    test('should show create session button', async ({ page }) => {
      await page.goto('/sessions');
      await expect(page.getByRole('link', { name: 'Create Session' }).first()).toBeVisible();
    });

    test('should create a new session', async ({ page }) => {
      await page.goto('/sessions/create');
      await page.getByLabel('Session Name').fill('New Playwright Session');
      await page.getByLabel('Date').fill('2026-06-15');
      await page.getByLabel('Teacher').selectOption({ index: 1 });
      await page.getByLabel('Description').fill('A session created by Playwright test');
      await page.getByRole('button', { name: 'Create Session' }).click();
      await expect(page).toHaveURL(/\/sessions/);
      await expect(page.getByText('New Playwright Session')).toBeVisible();
    });

    test('should edit a session', async ({ page }) => {
      await page.goto('/sessions');
      const card = page.locator('.bg-white').filter({ hasText: 'New Playwright Session' });
      await card.getByRole('link', { name: 'View Details' }).click();
      await page.getByRole('button', { name: 'Edit' }).click();
      await page.getByLabel('Session Name').fill('Updated Playwright Session');
      await page.getByRole('button', { name: 'Update Session' }).click();
      await expect(page).toHaveURL(/\/sessions/);
    });

    test('should delete a session', async ({ page }) => {
      acceptConfirmDialogs(page);
      await page.goto('/sessions');
      const card = page.locator('.bg-white').filter({ hasText: 'Updated Playwright Session' });
      await card.getByRole('button', { name: 'Delete' }).click();
      await expect(page.getByText('Updated Playwright Session')).toHaveCount(0);
    });

    test('should show delete button on session cards', async ({ page }) => {
      await page.goto('/sessions');
      await expect(page.locator('.grid > div').first().getByRole('button', { name: 'Delete' })).toBeVisible();
    });
  });
});
