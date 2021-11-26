const path = require("path");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");

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
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [
                '**/*',
                '!images/**',
            ],
            cleanAfterEveryBuildPatterns: [
                "*.js", 
                "*.map", 
                "*.css",
                "*.LICENSE.txt"
            ]
        }),
        new HTMLWebpackPlugin({
            template: "./assets/index.html"
        })
    ]
};
