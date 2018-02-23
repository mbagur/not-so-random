const webpack = require('webpack');
const path = require('path');
const libraryName = 'notSoRandom';
const outputFile = libraryName + '.js';

const config = {
    context: path.resolve(__dirname + '/src'),
    entry: __dirname + '/src/index.js',
    output: {
        path: __dirname + '/lib',
        filename: outputFile,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        rules: [
            { test: /(\.js)$/, use: 'babel-loader', exclude: /(node_modules)/ }
        ]
    },
    resolve: {
        extensions: ['.js']
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        sourceMap: true
      })
    ]
};

module.exports = config;
