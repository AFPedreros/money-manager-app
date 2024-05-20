export function formatCurrency(
  amount: number,
  locale: string = "en-US",
  currency: string = "USD"
): string {
  return amount.toLocaleString(locale, {
    style: "currency",
    currency: currency,
  });
}
