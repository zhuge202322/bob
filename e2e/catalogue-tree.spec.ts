import { expect, test } from '@playwright/test'

const catalogueUrl = 'http://localhost:3000/en/products'

test('only the category toggle expands and collapses third-level categories', async ({ page }) => {
  await page.goto(catalogueUrl)

  const categoryTree = page.locator('.stitch-category-tree')
  const toggle = page.getByRole('button', { name: 'Expand Molecular Biology Reagents' })
  const categoryLink = categoryTree.getByRole('link', { name: /Molecular Biology Reagents 40/ })
  const thirdLevelLink = categoryTree.getByRole('link', { name: /Nucleic Acid Extraction & Purification/ })

  await expect(toggle).toBeVisible()
  await expect(thirdLevelLink).toBeHidden()

  const initialUrl = page.url()
  await toggle.click()
  await expect(page).toHaveURL(initialUrl)
  await expect(thirdLevelLink).toBeVisible()
  await expect(categoryLink).toHaveAttribute('href', /category=/)

  await page.getByRole('button', { name: 'Collapse Molecular Biology Reagents' }).click()
  await expect(page).toHaveURL(initialUrl)
  await expect(thirdLevelLink).toBeHidden()
})

test('keeps the category list scrollable without reserving scrollbar space', async ({ page }) => {
  await page.goto(catalogueUrl)

  const categoryList = page.locator('.stitch-catalogue-category-list')
  const styles = await categoryList.evaluate((element) => {
    const computed = getComputedStyle(element)
    return {
      overflowY: computed.overflowY,
      scrollbarWidth: computed.scrollbarWidth,
      scrollbarGutter: computed.scrollbarGutter,
      scrollable: element.scrollHeight > element.clientHeight,
    }
  })

  expect(styles).toEqual({
    overflowY: 'auto',
    scrollbarWidth: 'none',
    scrollbarGutter: 'auto',
    scrollable: true,
  })
})
