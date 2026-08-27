import { FlatCompat } from '@eslint/eslintrc'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const directory = path.dirname(fileURLToPath(import.meta.url))
const compat = new FlatCompat({ baseDirectory: directory })

const config = [
  { ignores: ['.next/**', 'node_modules/**', 'backups/**', 'storage/**', 'tmp/**', '.superpowers/**', '网站资料/**', 'next-env.d.ts'] },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  { rules: { '@next/next/no-img-element': 'off', '@typescript-eslint/no-explicit-any': 'off' } }
]

export default config
