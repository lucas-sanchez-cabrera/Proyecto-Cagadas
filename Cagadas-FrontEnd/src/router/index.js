import { createRouter, createWebHistory } from "vue-router";

import Login from "../pages/Login.vue";
import Home from "../pages/Home.vue";
import UserSetting from "../pages/UserSetting.vue";

// ---- Simulación de autenticación ----
const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

const routes = [
  {
    path: "/",
    redirect: "/login"
  },

  {
    path: "/login",
    component: Login,
    meta: { title: "Login" }
  },
  //Poner en true cuando se acabe el proyecto
  {
    path: "/home",
    component: Home,
    meta: { requiresAuth: false, title: "Home" }
  },

  {
    path: "/user-setting",
    component: UserSetting,
    meta: { requiresAuth: false, title: "User Setting" }
  },

  {
    path: "/:pathMatch(.*)*",
    component: () => import("../pages/NotFound.vue"),
    meta: { title: "404" }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// ---- GUARD PRINCIPAL (protege rutas privadas) ----
router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return "/login";
  }
});

// ---- TÍTULO DINÁMICO ----
router.afterEach((to) => {
  const pageTitle = to.meta.title || "";
  document.title = pageTitle
    ? `${pageTitle} - Contador Cagadas`
    : "Contador Cagadas";
});

export default router;

 