
const glob = require('glob');

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const io = './node_modules/socket.io-client/dist/socket.io.js';


module.exports = {
    entry: {
        root: {
            import: './src/js/root/index.js',
            filename: 'js/root.bundle.js'
        }
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
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
            filename: 'css/[name].bundle.css'
        })
    ]
};


/*
module.exports = {
    entry: {
        root: {
            import: [
                './src/js/root/index.js',
                io
            ], 
            dependOn: 'shared'

        },
        cssRoot: './src/css/root/index.css'
        
        styles: [
            './src/css/common/reset.css',
            './src/css/common/header.css',
            './src/css/common//footer.css',
            './src/css/root/index.css'
        ]
        
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            // フォントファイルの処理用ルール
            {
                test: /\.(woff|woff2)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext]' // 出力するフォントファイルのパス
                }
            }
            
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].bundle.css'
        })
    ],
};
*/