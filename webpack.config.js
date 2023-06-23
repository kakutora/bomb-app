const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        root: './src/js/root/index.js'
    },

    output: {
        filename: '[name].bundle.js', // バンドルファイル名にエントリーポイント名を使用
        path: path.resolve(__dirname, 'dist/js'), // JavaScript出力ディレクトリのパス
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
                    filename: 'fonts/[name][ext]' // 出力するフォントファイルのパス
                }
            }
        ],
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: '../css/[name].bundle.css', // CSS出力パスとファイル名にエントリーポイント名を使用
        }),
    ],
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