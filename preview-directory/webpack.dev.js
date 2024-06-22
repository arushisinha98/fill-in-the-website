const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/client/index.js',
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: 'bundle.js',
    publicPath: '/js/'
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    publicPath: '/js/',
    port: 8080
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'] // Corrected preset name
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }
    ]
  },
};

