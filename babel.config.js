module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: [
    "@babel/plugin-transform-private-methods", // Add this line
    "@babel/plugin-transform-class-properties", // Optional (if using static class fields)
  ],
};
