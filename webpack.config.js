const PathModule = require('path');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    target: 'node',
    entry: {
        renderer: './src/renderer/main.ts',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/i,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        configFile: 'tsconfig.renderer.json'
                    }
                }],
                exclude: [/node_modules/]
            },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'renderer.js',
        path: PathModule.resolve(__dirname, 'build')
    },
    externals: {
        // electron: 'electron'
    }
}