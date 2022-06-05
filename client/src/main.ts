import {createApp} from "vue";
import {createPinia} from "pinia";
import App from "./App.vue";
import router from "./router";
import VueClickAway from "vue3-click-away";
import '@/assets/index.css'

import {useCommonStore} from "@/stores/common.store";
import {useRoomStore} from "@/stores/room.store";

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(VueClickAway)
app.mount("#app");

const commonStore = useCommonStore()
const roomStore = useRoomStore()

commonStore.commonSocketListeners()
roomStore.roomSocketListeners()
