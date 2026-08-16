import { createApp } from "vue";
import "@fontsource/archivo-black";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/400-italic.css";
import "@fontsource/fraunces/700.css";
import "@fontsource/fraunces/900.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "./style.css";
import App from "./App.vue";
import { reveal } from "./directives/reveal";

const app = createApp(App);
app.directive("reveal", reveal);
app.mount("#app");
