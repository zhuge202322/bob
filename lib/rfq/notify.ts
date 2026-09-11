import nodemailer, { type Transporter } from 'nodemailer'
import { prisma } from '@/lib/prisma'

export type RfqNotificationInput = {
  reference: string; company: string; contactName: string; email: string; productDescription: string
  quantity: string; country: string; city: string; catNo: string; brand: string; temperature: string
  notes: string; sourcePath: string
}

export function buildRfqNotification(rfq: RfqNotificationInput) {
  const subject = `[ZEHOLYN BIOTECH RFQ] ${rfq.reference} · ${rfq.company}`
  const text = [
    `Reference: ${rfq.reference}`, `Company: ${rfq.company}`, `Contact: ${rfq.contactName}`,
    `Email: ${rfq.email}`, `Location: ${rfq.country}, ${rfq.city}`, `Brand: ${rfq.brand || 'Not specified'}`,
    `CAT No.: ${rfq.catNo || 'Not specified'}`, `Quantity: ${rfq.quantity || 'Not specified'}`,
    `Temperature: ${rfq.temperature}`, `Product / specification: ${rfq.productDescription}`,
    `Notes: ${rfq.notes || 'None'}`, `Source: ${rfq.sourcePath}`
  ].join('\n')
  return { subject, text }
}

function createTransport(): Transporter {
  const host = process.env.SMTP_HOST
  if (!host) throw new Error('SMTP is not configured')
  return nodemailer.createTransport({ host, port: Number(process.env.SMTP_PORT || 587), secure: process.env.SMTP_SECURE === 'true', auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS || '' } : undefined })
}

export async function notifyRfq(rfqId: number, transport: Transporter = createTransport()) {
  const rfq = await prisma.rfq.findUnique({ where: { id: rfqId }, include: { attachments: true } })
  if (!rfq) throw new Error('RFQ not found')
  const recipient = process.env.RFQ_NOTIFY_TO
  if (!recipient) throw new Error('RFQ_NOTIFY_TO is not configured')
  const message = buildRfqNotification({ ...rfq, productDescription: rfq.description })
  await transport.sendMail({ from: process.env.SMTP_FROM || process.env.SMTP_USER || recipient, to: recipient, replyTo: rfq.email, subject: message.subject, text: message.text })
  return message
}

export async function processRfqNotification(rfqId: number, transport?: Transporter) {
  try {
    await notifyRfq(rfqId, transport)
    return await prisma.rfq.update({ where: { id: rfqId }, data: { notificationStatus: 'SENT', notificationError: '', notificationAttempts: { increment: 1 }, notifiedAt: new Date() } })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Notification failed'
    return await prisma.rfq.update({ where: { id: rfqId }, data: { notificationStatus: 'FAILED', notificationError: message.slice(0, 500), notificationAttempts: { increment: 1 } } })
  }
}
