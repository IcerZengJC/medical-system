import Vue from "vue";
import "./plugins/axios";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// 引入element-ui
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);

// 设置反向代理，前端请求默认发送到 http://localhost:8888
// var axios = require("axios");
// axios.defaults.baseURL = "http://101.200.58.159:8001";
// axios.defaults.baseURL = "http://10.252.233.166:8001";
// axios.defaults.baseURL = "http://localhost:8888";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
