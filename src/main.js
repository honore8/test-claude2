import { createApp } from "vue";
import "@fontsource/fraunces/700.css";
import "@fontsource/fraunces/900.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "./style.css";
import App from "./App.vue";
import { reveal } from "./directives/reveal";

const app = createApp(App);
app.directive("reveal", reveal);
app.mount("#app");
