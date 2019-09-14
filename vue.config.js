process.env.VUE_APP_VERSION = require('./package.json').version;

let config = {};

if (process.env.VUE_APP_PUBLIC_PATH && process.env.VUE_APP_PUBLIC_PATH !== '/') {
  config.publicPath = process.env.VUE_APP_PUBLIC_PATH;
}

module.exports = config;