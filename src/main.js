import { createApp } from "vue";
import ConfigProvider from "ant-design-vue/lib/config-provider";
import "ant-design-vue/lib/layout/style";
import Layout from "ant-design-vue/lib/layout";
import "ant-design-vue/lib/layout/style";
import Row from "ant-design-vue/lib/row";
import "ant-design-vue/lib/row/style";
import Card from "ant-design-vue/lib/card";
import "ant-design-vue/lib/card/style";
import Select from "ant-design-vue/lib/select";
import "ant-design-vue/lib/select/style";
import Button from "ant-design-vue/lib/button";
import "ant-design-vue/lib/button/style";
import Skeleton from "ant-design-vue/lib/skeleton";
import "ant-design-vue/lib/skeleton/style";
import message from "ant-design-vue/lib/message";
import "ant-design-vue/lib/message/style";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

document.getElementById("loading").style.display = "none";

const app = createApp(App);

app
  .use(ConfigProvider)
  .use(Layout)
  .use(Row)
  .use(Card)
  .use(Select)
  .use(Skeleton)
  .use(Button)
  .use(store)
  .use(router)
  .mount("#app");

app.config.globalProperties.$message = message;
