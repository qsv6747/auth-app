import { createApp } from "vue";
import App from "./App.vue";
import router from "./router.js";
import "./style.css";

window.addEventListener("error", (e) => {
  document.body.innerHTML =
    "<pre style='color:red;white-space:pre-wrap;padding:16px'>" +
    "JS ERROR: " + e.message + "\n" + (e.error && e.error.stack || "") +
    "</pre>";
});

try {
  createApp(App).use(router).mount("#app");
} catch (err) {
  document.body.innerHTML =
    "<pre style='color:red;white-space:pre-wrap;padding:16px'>" +
    "MOUNT ERROR: " + err.message + "\n" + (err.stack || "") +
    "</pre>";
}
