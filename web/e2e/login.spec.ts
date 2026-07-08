import { test, expect } from '@playwright/test'

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

// Smoke login as each RBAC role and assert the dashboard renders.
const ROLES = [
  { email: 'bob.buyer@mkt.io', role: 'buyer', label: 'buyer' },
  { email: 'sara.seller@mkt.io', role: 'seller', label: 'seller' },
  { email: 'alex.admin@mkt.io', role: 'admin', label: 'admin' },
]

const SEED_PASSWORD = 'Mkt@seed2026!'

test.describe('Login smoke', () => {
  test.beforeEach(async ({ page }) => {
    // Clear auth state before each test
    await page.goto(`${BASE}/login`)
    await page.evaluate(() => {
      localStorage.removeItem('mkt_token')
      localStorage.removeItem('mkt_user')
      localStorage.removeItem('mkt_cc_token')
    })
  })

  for (const { email, role, label } of ROLES) {
    test(`@smoke ${label} can log in and see the marketplace`, async ({ page }) => {
      await page.goto(`${BASE}/login`)

      // Fill in credentials
      await page.getByTestId('email-input').fill(email)
      await page.getByTestId('password-input').fill(SEED_PASSWORD)
      await page.getByTestId('login-submit').click()

      // Should redirect to marketplace feed
      await expect(page).toHaveURL(`${BASE}/`, { timeout: 15_000 })

      // Marketplace feed should render
      await expect(page.getByTestId('marketplace-feed')).toBeVisible({ timeout: 10_000 })

      // Navbar should show
      await expect(page.getByText('Marketplace')).toBeVisible()
    })
  }

  test('invalid credentials show error', async ({ page }) => {
    await page.goto(`${BASE}/login`)

    await page.getByTestId('email-input').fill('nobody@mkt.io')
    await page.getByTestId('password-input').fill('wrongpassword')
    await page.getByTestId('login-submit').click()

    // Should stay on login
    await expect(page).toHaveURL(`${BASE}/login`, { timeout: 8_000 })

    // Should show an error toast (filter out Next's empty route announcer which also has role=alert)
    await expect(page.getByRole('alert').filter({ hasText: /\S/ }).first()).toBeVisible({ timeout: 5_000 })
  })

  test('unauthenticated user is redirected to login', async ({ page }) => {
    await page.goto(`${BASE}/`)
    await expect(page).toHaveURL(`${BASE}/login`, { timeout: 8_000 })
  })
})
