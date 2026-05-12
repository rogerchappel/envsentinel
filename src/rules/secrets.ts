const secretNamePattern = /(SECRET|TOKEN|PASSWORD|PRIVATE|API_KEY|ACCESS_KEY|CLIENT_SECRET)/i;
const placeholderPattern = /^(|changeme|change-me|example|sample|todo|your_.+|<.+>|\$\{.+\})$/i;

export function looksSecretLike(name: string, value: string | undefined): boolean {
  if (!value || placeholderPattern.test(value.trim())) return false;
  if (/^\*+$/.test(value.trim())) return false;
  if (secretNamePattern.test(name) && value.trim().length >= 8) return true;
  if (/^[A-Za-z0-9_\-]{24,}$/.test(value.trim()) && !value.includes('example')) return true;
  if (/-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(value)) return true;
  return false;
}
