'use client'

import { FormEvent, useState } from 'react'
import { ArrowRight, LockKeyhole } from 'lucide-react'

export default function AdminLoginPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError('')
    const form = new FormData(event.currentTarget)
    const response = await fetch('/api/admin/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: form.get('email'), password: form.get('password') }) })
    if (!response.ok) { setError((await response.json()).error || 'Unable to sign in'); setLoading(false); return }
    window.location.href = '/admin'
  }
  return <main className="login-shell"><div className="login-panel"><div className="admin-brand login-brand"><span>Z</span><div>ZEHOLYN<small>BIOTECH ADMIN</small></div></div><div className="login-heading"><LockKeyhole size={20}/><span>Secure content workspace</span></div><h1>Sign in to manage the site</h1><p>Update products, pages, contacts, social channels and RFQ operations.</p><form onSubmit={submit}><label>Email<input name="email" type="email" required autoComplete="username" placeholder="admin@zeholyn.local" /></label><label>Password<input name="password" type="password" required autoComplete="current-password" /></label>{error ? <p className="form-error" role="alert">{error}</p> : null}<button className="admin-save" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}<ArrowRight size={15}/></button></form></div></main>
}
