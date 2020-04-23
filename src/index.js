import conversation from "./components/messagebody/conversation.vue";
import messagebody from "./components/messagebody/messagebody.vue";
import collection from "./components/messagebody/collection.vue";
import collectbody from "./components/messagebody/collectbody.vue";

import packge from "../package.json";

export function install(Vue) {
  Vue.component("conversation", conversation);
  Vue.component("messagebody", messagebody);
  Vue.component("collection", collection);
  Vue.component("collectbody", collectbody);
}

export { conversation, messagebody, collection, collectbody };

/* -- Plugin definition & Auto-install -- */
/* You shouldn't have to modify the code below */

// Plugin
const plugin = {
  /* eslint-disable no-undef */
  version: packge.version,
  install
};

export default plugin;

// Auto-install
let GlobalVue = null;
if (typeof window !== "undefined") {
  GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}
