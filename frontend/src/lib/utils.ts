import { v4 as uuidv4 } from "uuid";

export function formatCurrency(
  amount: string,
  locale: string = "en-US",
  currency: string = "USD",
): string {
  const numberAmount = Number(amount);
  return numberAmount.toLocaleString(locale, {
    style: "currency",
    currency: currency,
  });
}

export function getOrCreateUUID() {
  let uuid = localStorage.getItem("expenses-user-uuid");
  if (!uuid) {
    uuid = uuidv4();
    localStorage.setItem("expenses-user-uuid", uuid);
  }
  return uuid;
}
