import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/index",
    name: "Index",
    component: () => import("../views/Index.vue"),
    // 里面的 name 属性都得用 '' 括起来
    children: [
      {
        path: "/",
        name: "",
        component: () => import("../views/Prescribe.vue"),
      },
      {
        path: "prescribe",
        name: "Prescribe",
        component: () => import("../views/Prescribe"),
      },
      {
        path: "charge",
        name: "Charge",
        component: () => import("../views/Charge"),
      },
      {
        path: "search",
        name: "Search",
        component: () => import("../views/Search.vue"),
      },
      {
        path: "refund",
        name: "Refund",
        component: () => import("../views/Refund.vue"),
      },
      {
        path: "fetchmedicine",
        name: "FetchMedicine",
        component: () => import("../views/FetchMedicine.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

export default router;
