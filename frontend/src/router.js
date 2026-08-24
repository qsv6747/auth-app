import { createRouter, createWebHistory } from "vue-router";
import Login from "./views/Login.vue";
import Signup from "./views/Signup.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", name: "login", component: Login },
  { path: "/signup", name: "signup", component: Signup },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
