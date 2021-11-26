const { DefinePlugin } = require("webpack");
const { merge } = require("webpack-merge");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const commonConfig = require("./webpack-common.config");

module.exports = merge(commonConfig, {
    mode: "production",
    watch: false,
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            modules: true
                        }
                    },
                    "sass-loader"
                ]
            },
            {
                test: /\.(jpe?g|png)$/i,
                loader: "file-loader",
                options: {
                    name: "images/[contenthash].[ext]"
                }
            }
        ]
    },
    plugins: [
        new DefinePlugin({
            isDevMode: false,
            'process.env': {
                'NODE_ENV': '"production"'
            }
        }),
        new CleanWebpackPlugin({
            cleanAfterEveryBuildPatterns: [
                "images/"
            ]
        }),
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css"
        }),
        new CopyWebpackPlugin({
            patterns: [
                { 
                    force: true, 
                    from: "./assets/images/grass.png", 
                    to: "./images/[name].png" 
                },
                { 
                    force: true, 
                    from: "./assets/images/tilemap_72x72.png", 
                    to: "./images/[name].png" 
                },
                { 
                    force: true, from: "./assets/images/explosion.json", 
                    to: "./images/[name].json" 
                }
            ]
        })
    ]
});
