export default function CustomerHomePage() {
  return (
    <section aria-labelledby="customer-home-heading">
      <p className="text-sm font-semibold text-primary">Customer workspace</p>
      <h1 id="customer-home-heading" className="mt-2 text-heading-1 font-semibold">
        Welcome to AquaLoop
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Discover refill businesses, manage orders, and keep track of your
        reusable containers from one place.
      </p>
    </section>
  );
}
