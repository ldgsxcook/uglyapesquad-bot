export function numberFrom(value) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function intFrom(value, fallback = 0) {
  const parsed = numberFrom(value);
  return parsed === null ? fallback : Math.trunc(parsed);
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function formatNumber(value, options = {}) {
  const numeric = numberFrom(value);
  if (numeric === null) return "n/a";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    ...options
  }).format(numeric);
}

export function formatPrice(value, currency = "SOL") {
  const numeric = numberFrom(value);
  if (numeric === null) return "n/a";
  return `${formatNumber(numeric, { maximumFractionDigits: numeric < 1 ? 3 : 2 })} ${currency}`;
}

export function lamportsToSolMaybe(value) {
  const numeric = numberFrom(value);
  if (numeric === null) return null;
  return numeric > 100000 ? numeric / 1_000_000_000 : numeric;
}

export function compactAddress(address = "") {
  if (!address || address.length < 12) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function parseBool(value, fallback = false) {
  if (value === undefined || value === null || value === "") return fallback;
  return ["1", "true", "yes", "on"].includes(String(value).trim().toLowerCase());
}
