export default function OperatorDashboardPage() {
  return (
    <section aria-labelledby="operator-dashboard-heading">
      <p className="text-sm font-semibold text-primary">Operator workspace</p>
      <h1
        id="operator-dashboard-heading"
        className="mt-2 text-heading-1 font-semibold"
      >
        Business dashboard
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Manage customer orders, confirmation-code redemption, stock, and
        deliveries from this workspace.
      </p>
    </section>
  );
}
