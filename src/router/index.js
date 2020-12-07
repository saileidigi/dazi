import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Play from "../views/Play.vue";
import NotFound from "../views/NotFound.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/:id(\\d+)",
    name: "Play",
    component: Play
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
