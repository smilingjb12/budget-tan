import { d as db, g as exchangeRates, e as eq } from "./auth-DKIui-sa.js";
const millisecondsInWeek = 6048e5;
const millisecondsInDay = 864e5;
const millisecondsInMinute = 6e4;
const millisecondsInHour = 36e5;
const minutesInMonth = 43200;
const minutesInDay = 1440;
const constructFromSymbol = Symbol.for("constructDateFrom");
function constructFrom(date, value) {
  if (typeof date === "function") return date(value);
  if (date && typeof date === "object" && constructFromSymbol in date)
    return date[constructFromSymbol](value);
  if (date instanceof Date) return new date.constructor(value);
  return new Date(value);
}
function toDate(argument, context) {
  return constructFrom(context || argument, argument);
}
function addDays(date, amount, options) {
  const _date = toDate(date, options?.in);
  if (isNaN(amount)) return constructFrom(date, NaN);
  _date.setDate(_date.getDate() + amount);
  return _date;
}
function isBefore(date, dateToCompare) {
  return +toDate(date) < +toDate(dateToCompare);
}
class ExchangeRateService {
  static async getExchangeRate() {
    try {
      const existingRates = await db.select().from(exchangeRates);
      const latestRate = existingRates[0];
      if (latestRate && isBefore(/* @__PURE__ */ new Date(), addDays(latestRate.lastUpdatedAt, 1))) {
        return {
          rate: parseFloat(latestRate.rate ?? "0"),
          lastUpdatedAt: latestRate.lastUpdatedAt.toISOString()
        };
      }
      const apiKey = process.env.EXCHANGE_RATE_API_KEY;
      if (!apiKey) {
        console.warn("EXCHANGE_RATE_API_KEY not set, using default rate");
        return {
          rate: 4,
          // Default USD to PLN rate
          lastUpdatedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
      }
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`
      );
      if (!response.ok) {
        throw new Error(`Exchange rate API error: ${response.statusText}`);
      }
      const data = await response.json();
      const plnRate = data.conversion_rates.PLN;
      const now = /* @__PURE__ */ new Date();
      if (latestRate) {
        await db.update(exchangeRates).set({
          rate: plnRate.toString(),
          lastUpdatedAt: now
        }).where(eq(exchangeRates.id, latestRate.id));
      } else {
        await db.insert(exchangeRates).values({
          rate: plnRate.toString(),
          lastUpdatedAt: now
        });
      }
      return {
        rate: plnRate,
        lastUpdatedAt: now.toISOString()
      };
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      return {
        rate: 4,
        // Default USD to PLN rate
        lastUpdatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
  }
}
export {
  ExchangeRateService as E,
  millisecondsInWeek as a,
  minutesInDay as b,
  constructFrom as c,
  minutesInMonth as d,
  millisecondsInHour as e,
  millisecondsInMinute as f,
  millisecondsInDay as m,
  toDate as t
};
