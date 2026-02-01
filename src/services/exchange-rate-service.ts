import { db } from "~/db";
import { exchangeRates } from "~/db/schema/schema";
import { addDays, isBefore } from "date-fns";
import { eq } from "drizzle-orm";

export interface ExchangeRateDto {
  rate: number;
  lastUpdatedAt: string;
}

interface ExchangeRateResponse {
  result: string;
  conversion_rates: {
    PLN: number;
    [key: string]: number;
  };
}

export class ExchangeRateService {
  static async getExchangeRate(): Promise<ExchangeRateDto | null> {
    // Check if we have a cached exchange rate in the database
    const existingRates = await db.select().from(exchangeRates);
    const cachedRate = existingRates[0];

    // Helper to return cached rate as DTO
    const getCachedRateDto = (): ExchangeRateDto | null => {
      if (!cachedRate) return null;
      return {
        rate: parseFloat((cachedRate.rate as unknown as string) ?? "0"),
        lastUpdatedAt: cachedRate.lastUpdatedAt.toISOString(),
      };
    };

    // If we have a rate and it's less than a day old, return it
    if (
      cachedRate &&
      isBefore(new Date(), addDays(cachedRate.lastUpdatedAt, 1))
    ) {
      return getCachedRateDto();
    }

    // Otherwise, try to fetch a new rate from the API
    const apiKey = process.env.EXCHANGE_RATE_API_KEY;
    if (!apiKey) {
      // If no API key, return cached rate if available, otherwise null
      console.warn("EXCHANGE_RATE_API_KEY not set");
      return getCachedRateDto();
    }

    try {
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${apiKey}/latest/EUR`
      );

      if (!response.ok) {
        throw new Error(`Exchange rate API error: ${response.statusText}`);
      }

      const data = (await response.json()) as ExchangeRateResponse;
      const plnRate = data.conversion_rates.PLN;

      // Update or insert the rate in the database
      const now = new Date();
      if (cachedRate) {
        await db
          .update(exchangeRates)
          .set({
            rate: plnRate.toString(),
            lastUpdatedAt: now,
          })
          .where(eq(exchangeRates.id, cachedRate.id));
      } else {
        await db.insert(exchangeRates).values({
          rate: plnRate.toString(),
          lastUpdatedAt: now,
        });
      }

      return {
        rate: plnRate,
        lastUpdatedAt: now.toISOString(),
      };
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      // If API fails, return cached rate if available, otherwise null
      return getCachedRateDto();
    }
  }
}