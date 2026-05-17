import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { BalanceService } from "~/services/balance-service";
import { authMiddleware } from "~/middleware/auth";

export const getBalance = createServerFn({
  method: "GET",
})
  .middleware([authMiddleware])
  .handler(async () => {
    return await BalanceService.get();
  });

const setBalanceSchema = z.object({
  value: z.number(),
});

export const setBalance = createServerFn({
  method: "POST",
})
  .middleware([authMiddleware])
  .inputValidator(setBalanceSchema)
  .handler(async ({ data }) => {
    await BalanceService.overwrite(data.value);
    return await BalanceService.get();
  });
