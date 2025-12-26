export function formatTempC(v) {
  const n = Number(v);
  if (Number.isNaN(n)) return "—";
  return `${Math.round(n)}°C`;
}

export function formatWindKmh(v) {
  const n = Number(v);
  if (Number.isNaN(n)) return "—";
  return `${Math.round(n)} km/h`;
}
