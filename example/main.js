import Vue from "vue";
import App from "@/App.vue";
import router from "@/router";
import Vuetify from "vuetify";
import zhHans from "vuetify/es5/locale/zh-Hans";
import "vuetify/dist/vuetify.min.css";

Vue.config.productionTip = false;
Vue.use(Vuetify, {
  theme: {
    dark: false
  },
  options: {
    customProperties: true,
    minifyTheme(css) {
      return process.env.NODE_ENV === "production"
        ? css.replace(/[\s|\r\n|\r|\n]/g, "")
        : css;
    }
  }
});

new Vue({
  router,
  vuetify: new Vuetify({
    lang: {
      locales: { zhHans },
      current: "zhHans"
    }
  }),
  render: h => h(App)
}).$mount("#app");
