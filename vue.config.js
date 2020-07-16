module.exports = {
  publicPath: "/",
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        data: `
          @import "@/assets/stylesheet/base.scss";
        `
      }
    }
  },
  devServer: {
    open: true, //浏览器自动打开页面
    host: "0.0.0.0", //如果是真机测试，就使用这个IP
    port: 8081,
    proxy: {
      //配置跨域
      "^/api": {
        target: "http://10.3.4.18",
        ws: true,
        changOrigin: true
      },
      "^/api/alien": {
        target: "http://10.3.4.18",
        ws: true,
        changOrigin: true
      }
    }
    // https: true,
  },
  configureWebpack: {
    devtool: "source-map"
  }
};
