import Vue from "vue";
import VueRouter from "vue-router";
import Scroll2Load from "../views/Scroll2Load.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "scroll2load",
    component: Scroll2Load
  },
  {
    path: "/infinite",
    name: "infinite",
    component: () =>
      import(/* webpackChunkName: "infinite" */ "../views/InfiniteLoad.vue")
  }
];

const router = new VueRouter({
  routes
});

export default router;
