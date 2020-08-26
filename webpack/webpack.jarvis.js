// webpack.config.js
 
 /*
const getAddons = require('webpack-config-addons');
const webpackMerge = require('webpack-merge');
 
module.exports = (env) => {
  const addonsConfig = getAddons(env);
  const config = {
      entry: 'www/index.js'
      
  };
  const mergedConfig = webpackMerge(config, addonsConfig);
  return mergedConfig;
};
 
* merged config :
 
 {
  entry: 'src/index.js',
  ...
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.ejs',
      inject: false,
      hash: true,
      filename: `index.html`
    }),
    new Jarvis({
        port: 9090 // optional: set a port
    })
  ]
}
 

 
 
 
// webpack.html.js
 
const HtmlWebpackPlugin = require('html-webpack-plugin');
 
module.exports = (env) => ({
  plugins: [
    new HtmlWebpackPlugin({
      template: 'www/index.ejs',
      inject: false,
      hash: true,
      filename: `index.html`
    })
  ]
});
 */
//webpack.jarvis.js
 
const Jarvis = require('webpack-jarvis');
 
module.exports = (env) => ({
    plugins: [
      new Jarvis({
        port: 9090 // optional: set a port
      })
    ]
});
 