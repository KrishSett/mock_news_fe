import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import VueAwesomePaginate from "vue-awesome-paginate";
import "vue-awesome-paginate/dist/style.css";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);

// Plugins
app.use(router);
app.use(pinia);
app.use(VueAwesomePaginate);

// Global error handler
app.config.errorHandler = (err) => {
    console.error('Error handler:', err);
};

app.mount("#app");