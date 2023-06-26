const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        root: './src/js/root/index.js',
        game: './src/js/game/index.js'
    },

    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist/js'),
        publicPath: '/dist/' // publicPathの設定
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            // フォントファイルの処理用ルール
            {
                test: /\.(woff|woff2)$/,
                type: 'asset/resource',
                generator: {
                    filename: '../fonts/[name][ext]' // 出力するフォントファイルのパス
                }
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: 'file-loader', // または 'url-loader'
                        options: {
                            name: '[name].[ext]',
                            outputPath: '../img/'
                        }
                    }
                ]
            }
        ],
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: '../css/[name].bundle.css', // CSS出力パスとファイル名にエントリーポイント名を使用
        }),
    ],
};