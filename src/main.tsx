import { createRoot } from "react-dom/client";
import "./index.css";
import { Router } from "./router";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import resources from "@/components/locale/resources.json";
import NamaSDK from "@/utils/namaSDK";
import VConsole from "vconsole";
import { canvasId, videoId } from "./common/global";
import {
  MediaStreamTrackGeneratorPolyfills,
  MediaStreamTrackProcessorPollyfills,
} from "./utils/namaSDK/polyfills";
import { useWorker, isSafari } from "./utils/tools";

if (location.href.includes("__console=true")) {
  new VConsole();
}

// use videoframe only when use worker
MediaStreamTrackProcessorPollyfills(videoId, useWorker());
MediaStreamTrackGeneratorPolyfills(canvasId, useWorker());
NamaSDK.getInstance();

console.log("navigator", navigator.userAgent);

const LANG_STORAGE_KEY = "nama-web-lang";
const savedLang = localStorage.getItem(LANG_STORAGE_KEY);
const initialLang =
  savedLang && ["zh", "en", "ja"].includes(savedLang) ? savedLang : "zh";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    resources,
    lng: initialLang,
    fallbackLng: "zh",
    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  });

i18n.on("languageChanged", (lng) => {
  localStorage.setItem(LANG_STORAGE_KEY, lng);
});

createRoot(document.getElementById("root")!).render(<Router />);

if (isSafari()) {
  window.addEventListener("pagehide", () => {
    if (NamaSDK.instance) {
      NamaSDK.instance.destroy();
    }
  });
} else {
  window.addEventListener("beforeunload", () => {
    if (NamaSDK.instance) {
      NamaSDK.instance.destroy();
    }
  });
}
