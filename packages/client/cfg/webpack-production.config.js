const { DefinePlugin } = require("webpack");
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

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
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css"
        })
    ]
});
