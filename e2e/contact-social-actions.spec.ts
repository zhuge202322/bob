import { expect, test } from '@playwright/test'

const contactUrl = 'http://localhost:3000/en/contact'
const channelNames = ['WhatsApp', 'VK', 'Telegram', 'MAX'] as const

test('shows four branded customer-service actions with working destinations', async ({ page }) => {
  await page.goto(contactUrl)

  const actions = page.locator('.stitch-contact-social-actions')
  await expect(actions).toBeVisible()

  for (const channel of channelNames) {
    const link = actions.getByRole('link', { name: channel, exact: true })
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute('href', /^(https?:\/\/|mailto:).+/)
    await expect(link.locator('svg')).toHaveCount(1)
  }

  const backgrounds = await Promise.all(
    channelNames.map((channel) =>
      actions
        .getByRole('link', { name: channel, exact: true })
        .evaluate((element) => getComputedStyle(element).backgroundColor),
    ),
  )

  expect(new Set(backgrounds).size).toBe(4)
})

test('lays out the customer-service actions as a two-by-two grid on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(contactUrl)

  const actions = page.locator('.stitch-contact-social-actions')
  const boxes = await Promise.all(
    channelNames.map((channel) =>
      actions.getByRole('link', { name: channel, exact: true }).boundingBox(),
    ),
  )

  expect(boxes.every(Boolean)).toBe(true)
  const [whatsapp, vk, telegram, max] = boxes as NonNullable<(typeof boxes)[number]>[]
  expect(Math.abs(whatsapp.y - vk.y)).toBeLessThan(2)
  expect(Math.abs(telegram.y - max.y)).toBeLessThan(2)
  expect(telegram.y).toBeGreaterThan(whatsapp.y)
  expect(whatsapp.x).toBeLessThan(vk.x)
  expect(telegram.x).toBeLessThan(max.x)

  const actionBox = await actions.boundingBox()
  expect(actionBox).not.toBeNull()
  expect((actionBox?.x ?? 0) + (actionBox?.width ?? 0)).toBeLessThanOrEqual(390)
})
