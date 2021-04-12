const { DefinePlugin } = require("webpack");
const { merge } = require("webpack-merge");

const commonConfig = require("./webpack-common.config");

module.exports = merge(commonConfig, {
    mode: "development",
    watch: true,
    devtool: "eval-cheap-source-map",
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,
                            modules: {
                                localIdentName: "[path][name]__[local]"
                            },
                            sourceMap: true
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true
                        }
                    },
                ]
            }
        ]
    },
    plugins: [
        new DefinePlugin({
            isDevMode: true
        })
    ]
});