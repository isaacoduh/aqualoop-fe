import type { MoneyInMinorUnits } from "@/domain/types";

const poundsFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatMoney(amount: MoneyInMinorUnits): string {
  if (!Number.isSafeInteger(amount)) {
    throw new TypeError("Money must be an integer number of pence");
  }

  return poundsFormatter.format(amount / 100);
}
