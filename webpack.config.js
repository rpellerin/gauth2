const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin')
const eslintFormatter = require('react-dev-utils/eslintFormatter')
const paths = require('./config/paths')

// DEV ONLY
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')

if (!['production', 'development', 'test'].includes(process.env.NODE_ENV)) {
  throw new Error('NODE_ENV not set correctly')
}

const production = process.env.NODE_ENV === 'production'

const publicPath = production ? paths.servedPath : '/'
const publicUrl = publicPath.slice(0, -1)
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false'

module.exports = {
  mode: production ? 'production' : 'development',
  bail: production, // Don't attempt to continue if there are any errors.
  devtool: production
    ? shouldUseSourceMap
      ? 'source-map'
      : false
    : 'cheap-module-source-map',
  entry: [
    ...(production
      ? []
      : [require.resolve('react-dev-utils/webpackHotDevClient')]),
    paths.appIndexJs
  ],
  output: {
    pathinfo: !production, // Add /* filename */ comments to generated require()s in the output.
    path: paths.appBuild,
    filename: production
      ? 'static/js/[name].[chunkhash:8].js'
      : 'static/js/bundle.js',
    chunkFilename: production
      ? 'static/js/[name].[chunkhash:8].chunk.js'
      : 'static/js/[name].chunk.js',
    sourceMapFilename: production
      ? '[name]-[chunkhash:8].js.map'
      : '[name].js.map',
    // We inferred the "public path" (such as / or /my-project) from homepage.
    publicPath: publicPath,
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: info =>
      (production
        ? path.relative(paths.appSrc, info.absoluteResourcePath)
        : path.resolve(info.absoluteResourcePath)
      ).replace(/\\/g, '/')
  },
  resolve: {
    modules: ['node_modules', paths.appNodeModules, path.resolve('./src')],
    extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx'],
    plugins: [new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson])] // Prevents from importing files from outside of src/ (or node_modules/)
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(js|jsx|mjs)$/, // It's important to run the linter before Babel processes the JS
        enforce: 'pre',
        use: [
          {
            options: {
              formatter: eslintFormatter,
              eslintPath: require.resolve('eslint')
            },
            loader: require.resolve('eslint-loader')
          }
        ],
        include: paths.appSrc
      },
      {
        oneOf: [
          // "url" loader works just like "file" loader but it also embeds
          // assets smaller than specified size as data URLs to avoid requests.
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]'
            }
          },
          // Process JS with Babel.
          {
            test: /\.(js|jsx|mjs)$/,
            include: paths.appSrc,
            loader: require.resolve('babel-loader'),
            options: {
              compact: production,
              cacheDirectory: !production
            }
          },
          {
            test: /\.css$/,
            use: [
              require.resolve('style-loader'),
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1,
                  minimize: production,
                  sourceMap: production ? shouldUseSourceMap : true
                }
              },
              {
                loader: require.resolve('postcss-loader'),
                options: {
                  ident: 'postcss', // Necessary for external CSS imports to work https://github.com/facebookincubator/create-react-app/issues/2677
                  plugins: () => []
                }
              }
            ]
          },
          {
            loader: require.resolve('file-loader'),
            exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
            options: {
              name: 'static/media/[name].[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  },
  optimization: {
    minimize: production,
    removeAvailableModules: production,
    removeEmptyChunks: production,
    minimizer: [new UglifyJsPlugin({ sourceMap: shouldUseSourceMap })]
  },
  plugins: [
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      ...(production
        ? {
            minify: {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true
            }
          }
        : {})
    }),
    ...(production ? [] : [new webpack.NamedModulesPlugin()]),
    new webpack.DefinePlugin({
      'process.env.PUBLIC_URL': JSON.stringify(publicUrl)
    }),
    ...(production
      ? [
          // Generate a manifest file which contains a mapping of all asset filenames
          // to their corresponding output file so that tools can pick it up without
          // having to parse `index.html`.
          new ManifestPlugin({
            fileName: 'asset-manifest.json'
          }),
          // Generate a service worker script that will precache, and keep up to date,
          // the HTML & assets that are part of the Webpack build.
          new SWPrecacheWebpackPlugin({
            // By default, a cache-busting query parameter is appended to requests
            // used to populate the caches, to ensure the responses are fresh.
            // If a URL is already hashed by Webpack, then there is no concern
            // about it being stale, and the cache-busting can be skipped.
            dontCacheBustUrlsMatching: /\.\w{8}\./,
            filename: 'service-worker.js',
            logger(message) {
              if (message.indexOf('Total precache size is') === 0) {
                // This message occurs for every build and is a bit too noisy.
                return
              }
              if (message.indexOf('Skipping static resource') === 0) {
                // This message obscures real errors so we ignore it.
                // https://github.com/facebookincubator/create-react-app/issues/2612
                return
              }
              console.log(message)
            },
            minify: true,
            // For unknown URLs, fallback to the index page
            navigateFallback: publicUrl + '/index.html',
            // Ignores URLs starting from /__ (useful for Firebase):
            // https://github.com/facebookincubator/create-react-app/issues/2237#issuecomment-302693219
            navigateFallbackWhitelist: [/^(?!\/__).*/],
            // Don't precache sourcemaps (they're large) and build asset manifest:
            staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/]
          })
        ]
      : [new CaseSensitivePathsPlugin()])
  ],
  ...(production
    ? {}
    : {
        devServer: {
          contentBase: './public',
          compress: true,
          hot: true,
          open: true
        }
      }),
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  performance: {
    hints: production ? 'warning' : false
  }
}
