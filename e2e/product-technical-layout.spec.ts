import { expect, test } from '@playwright/test'

test('storage conditions spans the full technical data row', async ({ page }) => {
  await page.goto('http://localhost:3000/en/product/product-1-a25742')

  const grid = page.locator('.stitch-product-technical-grid')
  const storage = grid.locator('> div').filter({ hasText: 'Storage conditions' })
  const [gridBox, storageBox] = await Promise.all([grid.boundingBox(), storage.boundingBox()])

  expect(gridBox).not.toBeNull()
  expect(storageBox).not.toBeNull()
  expect(storageBox!.width / gridBox!.width).toBeGreaterThan(0.95)
  expect(Math.abs(storageBox!.x - gridBox!.x)).toBeLessThanOrEqual(2)
})
