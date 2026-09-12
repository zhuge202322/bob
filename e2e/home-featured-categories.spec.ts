import { expect, test } from '@playwright/test'

for (const locale of ['en', 'zh', 'ru'] as const) {
  test(`${locale} product category cards open their filtered product lists`, async ({ page }) => {
    await page.goto(`http://localhost:3000/${locale}`)

    const cards = page.locator('.stitch-category-cards > a')
    const cardCount = await cards.count()
    expect(cardCount).toBeGreaterThan(0)

    for (let index = 0; index < cardCount; index += 1) {
      await page.goto(`http://localhost:3000/${locale}`)

      const card = page.locator('.stitch-category-cards > a').nth(index)
      const categoryName = (await card.locator('h3').innerText()).trim()

      await card.click()

      await expect(page).toHaveURL(new RegExp(`/${locale}/products\\?category=.+`))
      await expect(page.locator('.stitch-catalogue-results h1')).toHaveText(categoryName)
      await expect(page.locator('.stitch-product-card').first()).toBeVisible()
    }
  })

  test(`${locale} featured category cards open their filtered product lists`, async ({ page }) => {
    for (let index = 0; index < 4; index += 1) {
      await page.goto(`http://localhost:3000/${locale}`)

      const card = page.locator('.stitch-inventory-grid > a').nth(index)
      const categoryName = (await card.locator('h3').innerText()).trim()

      await card.click()

      await expect(page).toHaveURL(new RegExp(`/${locale}/products\\?category=.+`))
      await expect(page.locator('.stitch-catalogue-results h1')).toHaveText(categoryName)
      await expect(page.locator('.stitch-product-card').first()).toBeVisible()
    }
  })
}
