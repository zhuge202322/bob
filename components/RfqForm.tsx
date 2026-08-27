'use client'

import { FormEvent, useState } from 'react'
import { ArrowRight, CircleCheck, LoaderCircle, Upload } from 'lucide-react'
import type { Locale } from '@/lib/i18n'

export default function RfqForm({ locale = 'en', initialCategory = '', initialCatNo = '' }: { locale?: Locale; initialCategory?: string; initialCatNo?: string }) {
  const [reference, setReference] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const copy = locale === 'zh'
    ? { submit: '提交询盘', sending: '正在提交…', contact: '联系信息', product: '产品需求', additional: '补充信息', company: '公司 / 机构', email: '工作邮箱', name: '联系人', country: '国家', city: '交付城市', desc: '产品名称、规格或完整需求', quantity: '数量', temp: '储存温区', consent: '我同意隐私政策并同意就此询盘被联系。', customer: '客户类型', messenger: '即时通讯账号', catNo: '货号 / CAT No.', date: '期望交付日期', notes: '项目或交付说明', brand: '品牌', attachment: '上传采购清单', attachmentHelp: 'PDF、XLSX、XLS、CSV 或 DOCX，最大 10 MB', success: '询盘已收到。', reference: '您的询盘编号为', followup: '采购团队将在 3 个工作日内联系您。' }
    : locale === 'ru'
      ? { submit: 'Отправить запрос', sending: 'Отправка…', contact: 'Контактные данные', product: 'Требования к продукту', additional: 'Дополнительная информация', company: 'Компания / организация', email: 'Рабочий email', name: 'Контактное лицо', country: 'Страна', city: 'Город доставки', desc: 'Продукт, спецификация или полный запрос', quantity: 'Количество', temp: 'Температурный режим', consent: 'Я принимаю политику конфиденциальности и согласен на связь по запросу.', customer: 'Тип клиента', messenger: 'Мессенджер', catNo: 'Артикул / CAT No.', date: 'Желаемая дата поставки', notes: 'Проект или условия поставки', brand: 'Бренд', attachment: 'Загрузить список закупки', attachmentHelp: 'PDF, XLSX, XLS, CSV или DOCX, до 10 МБ', success: 'Запрос получен.', reference: 'Номер вашего запроса', followup: 'Отдел снабжения свяжется с вами в течение 3 рабочих дней.' }
      : { submit: 'Send inquiry', sending: 'Sending…', contact: 'Contact information', product: 'Product requirements', additional: 'Additional information', company: 'Company / institution', email: 'Work email', name: 'Contact name', country: 'Country', city: 'Delivery city', desc: 'Product, specification or complete requirement', quantity: 'Quantity', temp: 'Storage temperature', consent: 'I agree to the privacy policy and consent to being contacted about this request.', customer: 'Customer type', messenger: 'Messenger handle', catNo: 'Catalogue / CAT No.', date: 'Desired delivery date', notes: 'Project or delivery notes', brand: 'Brand', attachment: 'Upload purchase list', attachmentHelp: 'PDF, XLSX, XLS, CSV or DOCX, max 10 MB', success: 'Request received.', reference: 'Your reference is', followup: 'Our sourcing desk will follow up within 3 business days.' }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    const form = new FormData(event.currentTarget)
    form.set('locale', locale)
    form.set('sourcePath', window.location.pathname)
    const response = await fetch('/api/rfq', { method: 'POST', body: form })
    if (!response.ok) {
      setError((await response.json().catch(() => null))?.error || 'Unable to save request')
      setLoading(false)
      return
    }
    const data = await response.json()
    setReference(data.reference)
    setLoading(false)
  }

  if (reference) return <div className="stitch-rfq-success rfq-success"><CircleCheck/><h2>{copy.success}</h2><p>{copy.reference} <strong>{reference}</strong>. {copy.followup}</p></div>

  return <form className="stitch-rfq-form rfq-form" onSubmit={submit}>
    <fieldset><legend><span>01</span>{copy.contact}</legend><div className="form-row"><label>{copy.name}<input name="contactName" required autoComplete="name"/></label><label>{copy.company}<input name="company" required minLength={2} autoComplete="organization"/></label></div><div className="form-row"><label>{copy.email}<input name="email" required type="email" autoComplete="email"/></label><label>{copy.messenger}<input name="messenger" placeholder="WhatsApp, VK or Telegram"/></label></div><div className="form-row"><label>{copy.customer}<select name="customerType" defaultValue="END_USER"><option value="END_USER">End user / laboratory</option><option value="DISTRIBUTOR">Distributor</option><option value="OTHER">Other</option></select></label><label>{copy.country}<input name="country" required autoComplete="country-name"/></label></div><label>{copy.city}<input name="city" required autoComplete="address-level2"/></label></fieldset>

    <fieldset><legend><span>02</span>{copy.product}</legend><div className="form-row"><label>{copy.brand}<input name="brand"/></label><label>{copy.catNo}<input name="catNo" defaultValue={initialCatNo}/></label></div><div className="form-row"><label>{copy.quantity}<input name="quantity"/></label><label>{copy.temp}<select name="temperature" defaultValue="UNKNOWN"><option value="UNKNOWN">Unknown / not specified</option><option value="AMBIENT">Ambient</option><option value="2_8">2–8°C</option><option value="MINUS_20">-20°C</option></select></label></div><label>{copy.desc}<textarea name="productDescription" required rows={5} defaultValue={initialCategory ? `Category: ${initialCategory}\n` : ''}/></label></fieldset>

    <fieldset><legend><span>03</span>{copy.additional}</legend><label>{copy.date}<input name="desiredDeliveryDate" type="date"/></label><label>{copy.notes}<textarea name="notes" rows={4}/></label><label className="stitch-upload-field upload-field"><Upload/><span><strong>{copy.attachment}</strong><small>{copy.attachmentHelp}</small></span><input name="attachment" type="file" accept=".pdf,.xlsx,.xls,.csv,.docx"/></label></fieldset>

    <label className="consent"><input name="consent" type="checkbox" value="true" required/>{copy.consent}</label>
    {error ? <p className="form-error" role="alert">{error}</p> : null}
    <button className="button primary stitch-rfq-submit" type="submit" disabled={loading}>{loading ? <><LoaderCircle className="spin" size={17}/>{copy.sending}</> : <>{copy.submit}<ArrowRight size={17}/></>}</button>
  </form>
}
