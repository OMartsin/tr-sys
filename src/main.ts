import { createApp } from "vue";
import "./assets/main.css";
import App from "./App.vue";
import router from "./router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { far } from "@fortawesome/free-regular-svg-icons";
import Vue3Toasity, { type ToastContainerOptions } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import '@mdi/font/css/materialdesignicons.css'
import { createPinia } from "pinia";
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import Chart from "vue-frappe-chart"

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    },
  },
})

library.add(fas);
library.add(far);

const app = createApp(App);
app.use(router).component("font-awesome-icon", FontAwesomeIcon);
app.use(vuetify)

app.use(Vue3Toasity, {
  autoClose: 3000,
} as ToastContainerOptions);
app.use(createPinia());
app.component('VueDatePicker', VueDatePicker);
app.use(Chart);
app.mount("#app");
