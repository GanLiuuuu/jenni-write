module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'https://gateway.ai.cloudflare.com', // 后端API服务器地址
        changeOrigin: true, // 允许跨域
        pathRewrite: {
          '^/api': '' // 路径重写
        }
      },
      '/api2': {
        target: 'https://api.semanticscholar.org', // 后端API服务器地址
        changeOrigin: true, // 允许跨域
        pathRewrite: {
          '^/api2': '' // 路径重写
        }
      }
  }
}
};
