import type { ReactNode } from "react";

import { classNames } from "@/lib/class-names";

export type DataTableAlignment = "left" | "center" | "right";

export interface DataTableColumn<Row> {
  id: string;
  header: ReactNode;
  cell: (row: Row) => ReactNode;
  align?: DataTableAlignment;
  className?: string;
  headerClassName?: string;
}

export interface DataTableProps<Row> {
  rows: readonly Row[];
  columns: readonly DataTableColumn<Row>[];
  getRowKey: (row: Row) => string;
  caption: string;
  emptyState?: ReactNode;
  className?: string;
  rowClassName?: (row: Row) => string | undefined;
}

const alignmentClassNames: Record<DataTableAlignment, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export function DataTable<Row>({
  rows,
  columns,
  getRowKey,
  caption,
  emptyState,
  className,
  rowClassName,
}: DataTableProps<Row>) {
  return (
    <div
      className={classNames(
        "overflow-hidden rounded-card border border-border bg-surface shadow-card",
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-160 border-collapse text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-surface-muted">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className={classNames(
                    "border-b border-border px-4 py-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase first:pl-5 last:pr-5",
                    alignmentClassNames[column.align ?? "left"],
                    column.headerClassName,
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.length > 0 ? (
              rows.map((row) => (
                <tr
                  key={getRowKey(row)}
                  className={classNames(
                    "transition-colors hover:bg-surface-subtle",
                    rowClassName?.(row),
                  )}
                >
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className={classNames(
                        "px-4 py-3.5 align-middle text-foreground first:pl-5 last:pr-5",
                        alignmentClassNames[column.align ?? "left"],
                        column.className,
                      )}
                    >
                      {column.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-10 text-center text-muted-foreground"
                >
                  {emptyState ?? "No records found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
