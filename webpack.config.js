var path = require('path');
var paths = {
  OUT: 'example',
  ENTRY_POINT: 'example/index.js',
};
var config = {};

config.entry = path.join(__dirname, paths.ENTRY_POINT);

config.output = {
  path: path.join(__dirname, paths.OUT),
  filename: 'bundle.js'
};

config.module = {
  loaders: [{
    test: /\.js?$/,
    loader: 'babel-loader',
    exclude: /node_modules/,
    query: {
      cacheDirectory: true
    },
    include: [
      path.join(__dirname, 'src')
    ]
  }, {
    test: /\.json$/,
    loader: 'json-loader'
  }]
};

config.resolve = {
  modulesDirectories: ['node_modules'],
  extensions: ['', '.js', 'json'],
  root: path.resolve('./src')
};

config.node = {
  net: 'empty',
  tls: 'empty',
  fs: 'empty'
};

module.exports = config;
