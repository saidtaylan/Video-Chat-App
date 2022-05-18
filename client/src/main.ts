import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import '@/assets/index.css'
import {MainServerAxios} from "@/utils/appAxios"

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.mount("#app");
app.config.globalProperties.$mainAxios = MainServerAxios;