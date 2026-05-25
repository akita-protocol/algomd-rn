/**
 * Format an Algorand address for display (truncated).
 */
export function formatAddress(address: string, chars = 5): string {
  if (address.length <= chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Format a number with locale-aware separators.
 */
export function formatNumber(num: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Format a currency value with its unit.
 */
export function formatCurrency(amount: number, currency = 'ALGO'): string {
  return `${formatNumber(amount)} ${currency}`;
}

/**
 * Format a date into a readable string.
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Format a date into a human-readable relative time string.
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 0) {
    // Future date
    const absDiff = Math.abs(diffInSeconds);
    if (absDiff < 60) return 'in a moment';
    if (absDiff < 3600) return `in ${Math.floor(absDiff / 60)}m`;
    if (absDiff < 86400) return `in ${Math.floor(absDiff / 3600)}h`;
    if (absDiff < 2592000) return `in ${Math.floor(absDiff / 86400)}d`;
    return formatDate(date);
  }

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return formatDate(date);
}

/**
 * Format an asset amount considering its decimals.
 */
export function formatAssetAmount(amount: number, decimals: number): string {
  const divisor = Math.pow(10, decimals);
  return formatNumber(amount / divisor, Math.min(decimals, 6));
}
