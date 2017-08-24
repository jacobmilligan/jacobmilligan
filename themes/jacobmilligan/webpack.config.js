const path = require('path');

module.exports = {
    output: {
        path: path.join(path.join(__dirname, 'static'), 'css'),
        filename: '[name].css'
    },
    loaders: [
        {
            test: /\.scss$/,
            loaders: ['style', 'css', 'sass']
        }
    ]
}
