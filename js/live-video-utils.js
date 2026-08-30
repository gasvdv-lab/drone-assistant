export function isPrivateIpv4(value) {
  const parts = String(value).trim().split('.').map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return false;
  return parts[0] === 10 || (parts[0] === 192 && parts[1] === 168) || (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31);
}

export function createLocalStreamUrl(ip, preset = '/') {
  const host = String(ip).trim();
  if (!isPrivateIpv4(host)) throw new Error('Gebruik een geldig privé-IP-adres, bijvoorbeeld 192.168.0.1.');
  return `http://${host}${String(preset || '/')}`;
}

export function validateLocalStreamUrl(value) {
  let url;
  try { url = new URL(value); } catch { throw new Error('De stream-URL is niet geldig.'); }
  if (url.protocol !== 'http:' || !isPrivateIpv4(url.hostname)) throw new Error('Alleen een lokale HTTP-URL met privé-IP is toegestaan.');
  return url.href;
}
