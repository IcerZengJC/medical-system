module.exports = {
  devServer: {
    host: "0.0.0.0",
    port: "8010",
    proxy: {
      "/pub": {
        // target: "http://192.168.1.109:8001/pub", // 寝室
        target: "http://10.252.233.166:8001/pub", // 校园网
        // target: "http://101.200.58.159:8001/pub",
        changeOrigin: true,
        pathRewrite: {
          "^/pub": "",
        },
      },
      "/doctor": {
        // target: "http://192.168.1.109:8001/doctor", // 寝室
        target: "http://10.252.233.166:8001/doctor", // 校园网
        // target: "http://101.200.58.159:8001/doctor",
        changeOrigin: true,
        pathRewrite: {
          "^/doctor": "",
        },
      },
      "/drug": {
        // target: "http://192.168.1.109:8001/drug", // 寝室
        target: "http://10.252.233.166:8001/drug", // 校园网
        // target: "http://101.200.58.159:8001/drug",
        changeOrigin: true,
        pathRewrite: {
          "^/drug": "",
        },
      },
      "/outpatient": {
        // target: "http://192.168.1.109:8001/outpatient", // 寝室
        target: "http://10.252.233.166:8001/outpatient", // 校园网
        // target: "http://101.200.58.159:8001/outpatient",
        changeOrigin: true,
        pathRewrite: {
          "^/outpatient": "",
        },
      },
    },
  },
};
