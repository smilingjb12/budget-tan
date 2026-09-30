import { appSettings, db } from "~/db";
import { DEFAULT_THEME, isThemeId, type ThemeId } from "~/lib/themes";

export type AppSettingsDto = {
  theme: ThemeId;
};

export const SettingsService = {
  async get(): Promise<AppSettingsDto> {
    const rows = await db
      .select({ theme: appSettings.theme })
      .from(appSettings)
      .limit(1);

    const theme = rows[0]?.theme;
    return {
      theme: theme && isThemeId(theme) ? theme : DEFAULT_THEME,
    };
  },

  /** Settings live in a single row, created on first write. */
  async setTheme(theme: ThemeId): Promise<void> {
    await db.transaction(async (tx) => {
      const rows = await tx
        .select({ id: appSettings.id })
        .from(appSettings)
        .limit(1);

      if (rows[0]) {
        await tx
          .update(appSettings)
          .set({ theme, updatedAt: new Date() });
      } else {
        await tx.insert(appSettings).values({ theme });
      }
    });
  },
};
