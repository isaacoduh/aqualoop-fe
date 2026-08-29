export default function AdminDashboardPage() {
  return (
    <section aria-labelledby="admin-dashboard-heading">
      <p className="text-sm font-semibold text-primary">Admin workspace</p>
      <h1
        id="admin-dashboard-heading"
        className="mt-2 text-heading-1 font-semibold"
      >
        Platform dashboard
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Oversee accounts, operations, catalogue data, and platform settings.
      </p>
    </section>
  );
}
