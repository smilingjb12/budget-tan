/**
 * Fills a LOCAL database with plausible mock data so the UI can be checked
 * without access to real data. Wipes existing records first.
 *
 *   npm run migrate && npm run seed:mock [-- --theme=night-ledger]
 *
 * Pair it with `VITE_MOCK_AUTH=true npm run dev` to skip Clerk sign-in.
 * Refuses to run against anything but localhost.
 */
import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { getPgConnectionConfig } from "./connection";
import * as schema from "./schema/schema";

dotenv.config({ path: ".env.local" });

const MONTHS_OF_HISTORY = 14;

type Template = {
  category: string;
  isExpense: boolean;
  /** How many records per month, inclusive range. */
  count: [number, number];
  amount: [number, number];
  comments: string[];
};

const TEMPLATES: Template[] = [
  { category: "Rent & Bills", isExpense: true, count: [3, 4], amount: [40, 850], comments: ["Rent", "Electricity", "Internet", "Mobile plan", "Water"] },
  { category: "Food", isExpense: true, count: [12, 20], amount: [4, 65], comments: ["Groceries", "Lidl", "Bakery", "Sushi", "Ramen", "Coffee", "Market"] },
  { category: "Leisure", isExpense: true, count: [2, 6], amount: [8, 90], comments: ["Cinema", "Concert", "Books", "Steam", "Museum"] },
  { category: "Transportation", isExpense: true, count: [1, 4], amount: [2, 40], comments: ["Metro", "Taxi", "Bus pass", "Bike repair"] },
  { category: "Travel", isExpense: true, count: [0, 2], amount: [120, 480], comments: ["Flights", "Hotel", "Train to Kyoto", "Airbnb"] },
  { category: "Shopping", isExpense: true, count: [0, 3], amount: [15, 160], comments: ["Shoes", "Jacket", "Kitchenware", "Headphones"] },
  { category: "Wellness and Beauty", isExpense: true, count: [0, 2], amount: [12, 70], comments: ["Haircut", "Pharmacy", "Gym"] },
  { category: "Other", isExpense: true, count: [1, 3], amount: [5, 60], comments: ["Post office", "Laundry", "Donation"] },
  { category: "Paycheck", isExpense: false, count: [1, 1], amount: [3900, 4200], comments: ["Salary"] },
  { category: "Gift", isExpense: false, count: [0, 1], amount: [50, 300], comments: ["Birthday"] },
];

/** Deterministic PRNG so every run produces the same screenshots. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function assertLocal(config: ReturnType<typeof getPgConnectionConfig>) {
  const host = config.connectionString
    ? new URL(config.connectionString).hostname
    : config.host;
  if (host !== "localhost" && host !== "127.0.0.1") {
    throw new Error(
      `Refusing to seed mock data into non-local database host "${host ?? "?"}".`
    );
  }
}

async function main() {
  const themeArg = process.argv.find((arg) => arg.startsWith("--theme="));
  const theme = themeArg ? themeArg.slice("--theme=".length) : "ink-and-seal";

  const config = getPgConnectionConfig();
  assertLocal(config);
  const pool = new Pool(config);
  const db = drizzle(pool, { schema });
  const random = mulberry32(42);
  const between = (min: number, max: number) => min + random() * (max - min);
  const pick = <T>(items: T[]) => items[Math.floor(random() * items.length)];

  const categoryRows = await db.select().from(schema.categories);
  const categoryIds = new Map(categoryRows.map((row) => [row.name, row.id]));

  const now = new Date();
  const rows: (typeof schema.records.$inferInsert)[] = [];
  for (let offset = MONTHS_OF_HISTORY - 1; offset >= 0; offset--) {
    const year = now.getFullYear();
    const month = now.getMonth() - offset;
    const lastDay =
      offset === 0
        ? now.getDate()
        : new Date(year, month + 1, 0).getDate();

    for (const template of TEMPLATES) {
      const categoryId = categoryIds.get(template.category);
      if (categoryId === undefined) continue;
      const count = Math.round(between(template.count[0], template.count[1]));
      for (let i = 0; i < count; i++) {
        const day = 1 + Math.floor(random() * lastDay);
        rows.push({
          categoryId,
          isExpense: template.isExpense,
          value: between(template.amount[0], template.amount[1]).toFixed(2),
          comment: pick(template.comments),
          date: new Date(year, month, day, 12),
        });
      }
    }
  }

  await db.transaction(async (tx) => {
    await tx.delete(schema.records);
    await tx.insert(schema.records).values(rows);
    await tx.delete(schema.balance);
    await tx.insert(schema.balance).values({ currentBalance: "52564.46" });
    await tx.delete(schema.regularPayments);
    await tx.insert(schema.regularPayments).values([
      { name: "Rent", amount: "850", lastModified: now },
      { name: "Internet", amount: "35.90", lastModified: now },
      { name: "Mobile plan", amount: "14.99", lastModified: now },
    ]);
    await tx.delete(schema.appSettings);
    await tx.insert(schema.appSettings).values({ theme });
  });

  console.log(`Seeded ${rows.length} records over ${MONTHS_OF_HISTORY} months, theme "${theme}".`);
  await pool.end();
}

main().catch((err) => {
  console.error("Mock seed failed");
  console.error(err);
  process.exit(1);
});
