import { ensureSchema, recentEvents } from "@/lib/db";

export async function getOverheadEvents(limit = 100) {
  await ensureSchema();
  const events = await recentEvents(limit);
  return { events };
}
