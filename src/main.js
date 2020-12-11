import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

document.getElementById("loading").style.display = "none";

const app = createApp(App);

app
  .use(window.antd)
  .use(store)
  .use(router)
  .mount("#app");
