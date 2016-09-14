var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var precss = require('precss');
var autoprefixer = require('autoprefixer');
var path = require('path');

var config = {
  context: __dirname + '/app',
  entry: './index.js',
  output: {
    path: __dirname + '/app',
    filename: 'bundle.js'
  },

  plugins: [
  new webpack.DefinePlugin({
    ON_TEST: process.env.NODE_ENV === 'test'
  }),
  new ExtractTextPlugin( "bundle.css" ),
  new webpack.ProvidePlugin({
    jQuery: 'jquery',
    $: 'jquery',
    jquery: 'jquery'
  })
  ],

  module: {
    loaders: [
      // {test: /\.js$/, loader: 'ng-annotate!babel?presets[]=es2015', exclude: /node_modules/},
      {test: /\.js$/, loader: 'ng-annotate!babel-loader', exclude: /node_modules/},
      { test: /\.(png|jpe?g|gif)$/, loader: "file-loader?name=img/img-[hash:6].[ext]" },
      {test: /\.html$/, loader: 'raw', exclude: /node_modules/},
      {test: /\.css$/, loader: 'style!css!postcss?sourceMap', exclude: /node_modules/},
      {test: /\.scss$/,
        loader: ExtractTextPlugin.extract(
          'style',
          'css!sass!postcss?sourceMap'
          ),
        exclude: /node_modules/
      },
      {test: /\.(woff2|woff|ttf|eot|svg)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loaders: [
          "url-loader?name=assets/fonts/[name]_[hash].[ext]"
        ]
      }
      ]
    },
    sassLoader: {
      includePaths: [  'app/base']
      // path.resolve(__dirname,'node_modules/bootstrap'),
    },
    postcss : [autoprefixer()]
  }
  ;





  if (process.env.NODE_ENV === 'production') {
    config.output.path = __dirname + '/dist/app_client';
    config.plugins.push(new webpack.optimize.UglifyJsPlugin());
    config.plugins.push(new ExtractTextPlugin('bundle.css'));
    config.devtool = 'source-map';
  }

  module.exports = config;


 // new webpack.optimize.UglifyJsPlugin({
 //      compress: { warnings: false },
 //      mangle: false,
 //      sourcemap: false,
 //      minimize: true,
 //      mangle: { except: ['$super', '$', 'exports', 'require', '$q', '$ocLazyLoad'] }
 //    })