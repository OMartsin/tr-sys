import { createApp } from "vue";
import "./assets/main.css";
import App from "./App.vue";
import router from "./router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import Vue3Toasity, { type ToastContainerOptions } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

library.add(fas);
library.add(far);

const app = createApp(App);
app.use(router).component("font-awesome-icon", FontAwesomeIcon);

app.use(Vue3Toasity, {
  autoClose: 3000,
} as ToastContainerOptions);
app.mount("#app");
