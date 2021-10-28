const path = require("path");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: "./src/ui/index.tsx",
    output: {
        filename: "[name].[contenthash].js",
        path: path.resolve(__dirname, "../dist"),
        publicPath: "/"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.(jpe?g|png)$/i,
                loader: "file-loader",
                options: {
                    name: "images/[name].[contenthash].[ext]"
                }
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanAfterEveryBuildPatterns: [
                "*.js", 
                "*.map", 
                "*.css", 
                "*.LICENSE.txt"
            ]
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: "./assets/images",
                    to: "./images"
                }
            ]
        }),
        new HTMLWebpackPlugin({
            template: "./assets/index.html"
        })
    ]
};
