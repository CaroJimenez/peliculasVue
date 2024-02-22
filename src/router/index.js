import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import MainView from "../views/MainView.vue";
import Scroll from "../components/Scroll.vue";

const routes = [
  {
    path: "/",
    component: () => import("../views/MainView.vue"),
  },
  {
    path: "/scroll",
    component: () => import("../components/Scroll.vue"),
  },
];

const router = new VueRouter({ routes });
export default router;
