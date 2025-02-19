import { Tolgee, DevTools, FormatSimple, BackendFetch } from "@tolgee/react";
import { FormatIcu } from "@tolgee/format-icu";
import { constantsTranslations } from "../helpers/constants";

const tolgeeConfig = Tolgee()
    .use(DevTools())
    .use(BackendFetch({ prefix: `cdn/translations` }))
    .use(FormatSimple())
    .use(FormatIcu())
    .init({
        language: localStorage.getItem("locale") || "en",
        apiUrl: import.meta.env.VITE_APP_TOLGEE_API_URL,
        apiKey: import.meta.env.VITE_APP_TOLGEE_API_KEY,
    });

export default tolgeeConfig;

export const selectLanguage = (language: constantsTranslations.TLocale) => {
    tolgeeConfig.changeLanguage(language);
    localStorage.setItem("locale", language);
};
