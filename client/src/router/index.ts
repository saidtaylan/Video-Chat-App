import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/HomeView.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/LoginView.vue"),
    },
    {
      path: "/r/:link",
      name: "room",
      component: () => import("@/views/RoomView.vue"),
    },
    {
      path: "/:catchAll(.*)",
      name: '404',
      component: () => import('@/views/404View.vue')
    }
  ],
});

export default router;
