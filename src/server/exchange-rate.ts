import { createServerFn } from "@tanstack/react-start";
import { ExchangeRateService } from "~/services/exchange-rate-service";
import { authMiddleware } from "~/middleware/auth";

export const getExchangeRate = createServerFn({
  method: "GET",
})
  .middleware([authMiddleware])
  .handler(async () => {
    return await ExchangeRateService.getExchangeRate();
  });
