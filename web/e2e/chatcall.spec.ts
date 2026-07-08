import { test, expect } from '@playwright/test'

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
const SEED_PASSWORD = 'Mkt@seed2026!'

// E2E: login → open conversation → send message → start call
// Exercises the real CometChat UI (CometChatConversations + CometChatMessages).
test.describe('CometChat chat & call flow @smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/login`)
    await page.evaluate(() => {
      localStorage.removeItem('mkt_token')
      localStorage.removeItem('mkt_user')
      localStorage.removeItem('mkt_cc_token')
    })
  })

  test('buyer can log in, open a conversation, send a message, and start a call', async ({ page }) => {
    // 1. Login as buyer
    await page.goto(`${BASE}/login`)
    await page.getByTestId('email-input').fill('bob.buyer@mkt.io')
    await page.getByTestId('password-input').fill(SEED_PASSWORD)
    await page.getByTestId('login-submit').click()
    await expect(page).toHaveURL(`${BASE}/`, { timeout: 15_000 })

    // 2. Navigate to conversations (chat tab / sidebar link)
    await page.getByTestId('nav-conversations').click()
    await expect(page).toHaveURL(`${BASE}/conversations`, { timeout: 8_000 })

    // 3. CometChat conversation list must render (real SDK component)
    const convList = page.locator('.cometchat-conversations, [data-testid="cometchat-conversation-list"]')
    await expect(convList.first()).toBeVisible({ timeout: 15_000 })

    // 4. Open the seed conversation (buyer→seller for Vintage Camera)
    const firstConv = page.locator('[role="option"], [data-testid="conversation-item"]').first()
    await expect(firstConv).toBeVisible({ timeout: 10_000 })
    await firstConv.click()

    // 5. CometChat message panel must be visible
    const messagePanel = page.locator('.cometchat-messages, [data-testid="cometchat-message-list"]')
    await expect(messagePanel.first()).toBeVisible({ timeout: 10_000 })

    // 6. Send a message via the CometChat composer
    const composer = page.locator('textarea[aria-label], .cometchat-message-composer textarea, [data-testid="message-input"]').first()
    await expect(composer).toBeVisible({ timeout: 8_000 })
    await composer.fill('Hello from Playwright — CometChat E2E test')
    await composer.press('Enter')

    // 7. Message should appear in the thread
    await expect(
      page.getByText('Hello from Playwright — CometChat E2E test')
    ).toBeVisible({ timeout: 10_000 })

    // 8. Initiate a call (video or audio call button in the header)
    const callBtn = page
      .locator('[aria-label*="call" i], [aria-label*="video" i], [data-testid="call-btn"]')
      .first()
    await expect(callBtn).toBeVisible({ timeout: 8_000 })
    await callBtn.click()

    // 9. Call UI (outgoing call modal / ringing screen) must appear
    const callUI = page.locator(
      '.cometchat-outgoing-call, [data-testid="outgoing-call"], [aria-label*="Calling" i]'
    ).first()
    await expect(callUI).toBeVisible({ timeout: 10_000 })
  })
})
