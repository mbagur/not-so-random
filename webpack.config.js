var webpack = require('webpack');
var path = require('path');
var libraryName = 'notSoRandom';
var outputFile = libraryName + '.js';

var config = {
    entry: __dirname + '/src/index.js',
    output: {
        path: __dirname + '/lib',
        filename: outputFile,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        loaders: [
            { test: /(\.js)$/, loader: 'babel', exclude: /(node_modules)/ }
        ]
    },
    resolve: {
        root: path.resolve('./src'),
        extensions: ['', '.js']
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({ minimize: true })
    ]
};

module.exports = config;
