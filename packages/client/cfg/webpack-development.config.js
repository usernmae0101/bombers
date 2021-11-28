const { DefinePlugin } = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
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
            },
            {
                test: /\.(jpe?g|png)$/i,
                loader: "file-loader",
                options: {
                    emitFile: false,
                    name: "images/[name].[ext]"
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [
                '**/*',
                '!images/**'
            ],
            cleanAfterEveryBuildPatterns: [
                "*.js", 
                "*.map", 
                "*.css",
                "*.LICENSE.txt"
            ]
        }),
        new DefinePlugin({
            isDevMode: true,
            'process.env': {
                'NODE_ENV': '"development"'
            }
        })
    ]
});
