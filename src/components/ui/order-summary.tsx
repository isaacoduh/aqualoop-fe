import type { MoneyInMinorUnits } from "@/domain/types";
import { formatMoney } from "@/lib/money";
import { classNames } from "@/lib/class-names";

export interface OrderSummaryItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: MoneyInMinorUnits;
  lineTotal?: MoneyInMinorUnits;
  detail?: string;
}

export interface OrderSummaryProps {
  items: readonly OrderSummaryItem[];
  subtotal: MoneyInMinorUnits;
  deliveryFee: MoneyInMinorUnits;
  depositAmount: MoneyInMinorUnits;
  discount: MoneyInMinorUnits;
  total: MoneyInMinorUnits;
  businessName?: string;
  orderNumber?: string;
  className?: string;
}

function SummaryLine({
  label,
  value,
  emphasized = false,
}: {
  label: string;
  value: string;
  emphasized?: boolean;
}) {
  return (
    <div
      className={classNames(
        "flex items-baseline justify-between gap-4",
        emphasized && "text-base font-semibold text-foreground",
      )}
    >
      <dt>{label}</dt>
      <dd className="shrink-0 tabular-nums">{value}</dd>
    </div>
  );
}

export function OrderSummary({
  items,
  subtotal,
  deliveryFee,
  depositAmount,
  discount,
  total,
  businessName,
  orderNumber,
  className,
}: OrderSummaryProps) {
  return (
    <section
      aria-label="Order summary"
      className={classNames(
        "overflow-hidden rounded-card border border-border bg-surface shadow-card",
        className,
      )}
    >
      <header className="border-b border-border px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="font-semibold tracking-tight text-foreground">
              Order summary
            </h2>
            {businessName ? (
              <p className="mt-1 text-sm text-muted-foreground">
                {businessName}
              </p>
            ) : null}
          </div>
          {orderNumber ? (
            <span className="font-mono text-xs font-semibold text-muted-foreground">
              {orderNumber}
            </span>
          ) : null}
        </div>
      </header>

      <ul className="divide-y divide-border px-5 sm:px-6">
        {items.map((item) => {
          const lineTotal = item.lineTotal ?? item.unitPrice * item.quantity;

          return (
            <li
              key={item.id}
              className="flex items-start justify-between gap-4 py-4"
            >
              <div className="min-w-0">
                <p className="font-medium text-foreground">{item.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.quantity} × {formatMoney(item.unitPrice)}
                  {item.detail ? ` · ${item.detail}` : ""}
                </p>
              </div>
              <p className="shrink-0 font-medium tabular-nums text-foreground">
                {formatMoney(lineTotal)}
              </p>
            </li>
          );
        })}
      </ul>

      <dl className="space-y-2 border-t border-border px-5 py-4 text-sm text-muted-foreground sm:px-6">
        <SummaryLine label="Subtotal" value={formatMoney(subtotal)} />
        <SummaryLine label="Delivery" value={formatMoney(deliveryFee)} />
        <SummaryLine label="Bottle deposit" value={formatMoney(depositAmount)} />
        {discount > 0 ? (
          <SummaryLine label="Discount" value={`−${formatMoney(discount)}`} />
        ) : null}
        <div className="my-3 border-t border-border" />
        <SummaryLine label="Total" value={formatMoney(total)} emphasized />
      </dl>
    </section>
  );
}
