const path = require("path");

module.exports = {
    target: "node",
    node: {
        __dirname: false,
    },
    entry: "./src/server.ts",
    output: {
        publicPath: '/',
        path: path.resolve(__dirname, "dist"),
        filename: "server.js"
    },
    externals: [
        /node_modules/, 
        "bufferutil", 
        "utf-8-validate"
    ],
    resolve: {
        extensions: [".ts", ".js"],
        fallback: {
            ws: false,
            fs: false,
            crypto: false,
            http: false,
            zlib: false,
            path: false,
            stream: false
        }
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader"
            },
            {
                test: /\.node$/,
                loader: "node-loader"
            }
        ]
    }
};
