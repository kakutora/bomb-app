
const glob = require('glob');

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        root: './src/js/root/index.js',
        game: './src/js/game/index.js',
        styles: [
            './src/css/common/reset.css',
            './src/css/common/header.css',
            './src/css/common//footer.css',
            './src/css/root/index.css'
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/bundle.css'
        })
    ]
};
