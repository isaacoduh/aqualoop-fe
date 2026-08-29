import "client-only";

import { db, delay } from "@/data/mock-db/db";

export async function resetDemoData(): Promise<void> {
  await delay();
  db.reset();
}
