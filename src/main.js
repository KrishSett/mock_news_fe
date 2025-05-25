import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from 'pinia';

const pinia = createPinia();
const app = createApp(App);

// Plugins
app.use(router);
app.use(pinia);

// Global error handler
app.config.errorHandler = (err) => {
    console.error('Error handler:', err);
};

app.mount("#app");