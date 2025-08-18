import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router/index.js";
import { createI18n } from "vue-i18n";
import messages from "./i18n/index.js";
import "./assets/tailwind.css";
import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { FaFlagUsa, FaFlag } from "oh-vue-icons/icons";
import { MdLanguage } from "oh-vue-icons/icons"; // Dodaj ten import
import {
  FaVideo,
  FaMicrophone,
  FaImage,
  FaFont,
  GiAnvilImpact,
  FaRocket,
  FaBars,
  FaHome,
  FaThList,
  FaPen,
  FaInfoCircle,
  FaAngleLeft,
  FaAngleRight,
  CoAudioSpectrum,
  CoVideo,
  CoImage,
  CoText,
  FaLanguage,
  FaUsers,
  FaBolt,
} from "oh-vue-icons/icons";

addIcons(
  FaFlagUsa,
  FaFlag,
  MdLanguage,
  FaVideo,
  FaMicrophone,
  FaImage,
  FaFont,
  GiAnvilImpact,
  FaRocket,
  FaBars,
  FaHome,
  FaThList,
  FaPen,
  FaInfoCircle,
  FaAngleLeft,
  FaAngleRight,
  CoAudioSpectrum,
  CoVideo,
  CoImage,
  CoText,
  FaLanguage,
  FaUsers,
  FaBolt
);
const pinia = createPinia();

const i18n = createI18n({
  legacy: false,
  locale: navigator.language.startsWith("pl") ? "pl" : "en",
  fallbackLocale: "en",
  messages,
});

const app = createApp(App);
app.component("oh-icon", OhVueIcon);
app
  .use(pinia)
  .use(router)
  .use(i18n)
  .use(Vue3Toastify, {
    autoClose: 3000,
  })
  .mount("#app");
