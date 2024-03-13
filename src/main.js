import { createApp } from "vue";
import router from './router'
import store from "./store/index.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import App from "./App.vue";

const app = createApp(App);

app.use(router)
app.use(store);
app.use(Toast);
app.mount("#app");