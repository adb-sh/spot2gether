import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import { createApi } from "@/Api";
import "bootstrap-icons/font/bootstrap-icons.scss";
import "./main.scss";
import { ThemeConfig } from "bootstrap-darkmode";

export const themeConfig = new ThemeConfig();
try {
  themeConfig.initTheme();
} catch (e) {
  console.error('failed to init theme');
}

createApp(App)
  .use(router)
  .use(createApi, {
    baseURL: process.env.VUE_APP_API_BASEURL,
    authBaseURL: process.env.VUE_APP_API_AUTH_BASEURL,
    publicBaseURL: process.env.VUE_APP_API_PUBLIC_BASEURL,
  })
  .mount("#app");
