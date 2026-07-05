import { test, expect, Page } from '@playwright/test'

test.describe('Frontend', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext()
    page = await context.newPage()
  })

  test('can go on homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveTitle(/Your Name/)

    const heading = page.locator('h1').first()

    await expect(heading).toHaveText(/Your Name/)
  })

  test('displays all homepage sections', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page.locator('text=Featured Work')).toBeVisible()
    await expect(page.locator('text=Latest Writing')).toBeVisible()
    await expect(page.locator('text=Tools & Technologies')).toBeVisible()
    await expect(page.locator('text="Let\'s build something together"')).toBeVisible()
  })

  test('navigates via navbar links', async ({ page }) => {
    await page.goto('http://localhost:3000')

    const navLinks = page.locator('nav a')
    await expect(navLinks).toHaveCount(5) // logo + 4 nav links
  })

  test('about page renders correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/about')

    await expect(page.locator('text=cat about.md')).toBeVisible()
    await expect(page.locator('text=My Story')).toBeVisible()
    await expect(page.locator('text=Current focus')).toBeVisible()
  })

  test('navbar and footer appear on about page', async ({ page }) => {
    await page.goto('http://localhost:3000/about')

    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
  })
})
