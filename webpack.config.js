const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const htmlPageNames = ['brand-campaign', 'hardware', 'simo', 'help']
const multipleHtmlPlugins = htmlPageNames.map((name) => {
  return new HtmlWebpackPlugin({
    template: `./src/${name}.html`, // relative path to the HTML files
    filename: `${name}.html`, // output HTML files
  })
})

module.exports = function (env, argv) {
  let distPath = argv.mode === 'development' ? '/' : ''
  return {
    entry: './src/index.js',
    mode: 'development',
    devServer: { open: true },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
      publicPath: distPath,
    },
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            // Creates `style` nodes from JS strings
            'style-loader',
            // Translates CSS into CommonJS
            'css-loader',
            // Compiles Sass to CSS
            'sass-loader',
          ],
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          { from: './images', to: './images' },
          { from: './videos', to: './videos' },
          { from: './base-style.css', to: './base-style.css' },
        ],
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html',
        minify: false,
      }),
      new CleanWebpackPlugin(),
    ].concat(multipleHtmlPlugins),
  }
}
