export function formatDate(iso: string, locale = 'uk-UA'): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(new Date(iso));
}

export function formatDateTime(iso: string, locale = 'uk-UA'): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(iso)
  );
}

export function formatPrice(value: number, currency = 'UAH', locale = 'uk-UA'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

// 90 -> "1 год 30 хв", 45 -> "45 хв"
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} хв`;
  return m === 0 ? `${h} год` : `${h} год ${m} хв`;
}

// Розбирає detail із відповіді FastAPI (рядок або список помилок валідації)
export function parseApiError(detail: unknown, fallback = 'Щось пішло не так'): string {
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail) && detail.length > 0) {
    return (
      detail
        .map((d: { msg?: string }) => d.msg ?? '')
        .filter(Boolean)
        .join('; ') || fallback
    );
  }
  return fallback;
}
