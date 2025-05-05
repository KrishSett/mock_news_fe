const path = require("path");

module.exports = {
  // Other Vue CLI configurations
  chainWebpack: (config) => {
    config.resolve.alias.set("@", path.resolve(__dirname, "src")); // This will make '@' point to 'src/'
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "@/assets/scss/variables"; @import "@/assets/scss/mixins";`,
      },
    },
  },
  devServer: {
    port: 4000,
  },
};
