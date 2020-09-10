"use strict";

import Vue from "vue";
import axios from "axios";

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  // baseURL: "/pub",
  // timeout: 60 * 1000, // Timeout
  withCredentials: true, // Check cross-site Access-Control
};
const _axios = axios.create(config);

_axios.interceptors.request.use(
  (config) => {
    // if (localStorage.JWT_TOKEN) {
    //   config.headers.authorization = `Bearer ${localStorage.JWT_TOKEN}`;
    // } else if (CookieUtil.getCookie("JWT_TOKEN")) {
    //   // 防止用户刷新后找到不到权限token
    //   config.headers.authorization = `Bearer ${CookieUtil.getCookie(
    //     "JWT_TOKEN"
    //   )}`;
    // } else {
    //   if (config.url !== "/api/signIn") {
    //     config.headers.authorization = `dummy`; // 为了防止webflux的默认拦截器发送www-authenticate强制弹窗
    //   }
    // }
    // 非登录请求，获取token 并曾header中设置
    if (config.url !== "/pub/login") {
      config.headers.authorization = sessionStorage.getItem("token");
      config.headers["access-token"] = sessionStorage.getItem("token");
      // console.log("gettoken", sessionStorage.getItem("token"));
    } else {
      console.log("不用设置");
    }
    console.log("config", config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error.request);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function(response) {
    // Do something with response data
    return response;
  },
  function(error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

Plugin.install = function(Vue, options) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      },
    },
    $axios: {
      get() {
        return _axios;
      },
    },
  });
};

Vue.use(Plugin);

export default Plugin;
