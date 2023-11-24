import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { auth } from "@/middlewares/auth";
import HomeView from "../views/HomePage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/me",
    name: "me",
    component: () =>
      import(/* webpackChunkName: "me" */ "../views/MePage.vue"),
    meta: {
      requireAuth: true,
    },
  },
  {
    path: "/user/:id",
    name: "user",
    meta: {
      allowEmbed: true,
    },
    component: () =>
      import(/* webpackChunkName: "user" */ "../views/UserPage.vue"),
  },
  {
    path: "/auth",
    name: "auth",
    component: () =>
      import(/* webpackChunkName: "auth" */ "../views/AuthPage.vue"),
  },
  {
    path: "/auth/callback",
    name: "authCallback",
    component: () =>
      import(/* webpackChunkName: "authCallback" */ "../views/AuthCallbackPage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (!to.name) next("/");
  else if (to.meta?.requireAuth) auth({ to, from, next, router });
  else next();
});

export default router;
