export function csvCell(value: unknown) {
  const text = String(value ?? '').replaceAll('"', '""').replaceAll('\r', ' ').replaceAll('\n', ' ')
  const safe = /^[=+\-@]/.test(text.trimStart()) ? `'${text}` : text
  return `"${safe}"`
}
