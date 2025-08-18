// filepath: d:\git nowe\prompt-forge\src\router\index.js
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../pages/HomeView.vue"),
  },
  {
    path: "/prompts",
    name: "PromptList",
    component: () => import("../pages/PromptList.vue"),
  },
  {
    path: "/create-prompt/:type",
    name: "CreatePrompt",
    component: () => import("../pages/CreatePrompt.vue"),
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../pages/AboutView.vue"),
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: () => import("../pages/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
