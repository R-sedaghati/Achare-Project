import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "bootstrap/dist/css/bootstrap.rtl.min.css";
import "leaflet/dist/leaflet.css";

const app = createApp(App);
app.use(router);
app.mount("#app");
