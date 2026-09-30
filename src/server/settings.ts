import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { SettingsService } from "~/services/settings-service";
import { authMiddleware } from "~/middleware/auth";
import { THEME_IDS } from "~/lib/themes";

export const getSettings = createServerFn({
  method: "GET",
})
  .middleware([authMiddleware])
  .handler(async () => {
    return await SettingsService.get();
  });

const setThemeSchema = z.object({
  theme: z.enum(THEME_IDS),
});

export const setTheme = createServerFn({
  method: "POST",
})
  .middleware([authMiddleware])
  .inputValidator(setThemeSchema)
  .handler(async ({ data }) => {
    await SettingsService.setTheme(data.theme);
    return await SettingsService.get();
  });
