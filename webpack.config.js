const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MinifyJsonPlugin = require('minify-json-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: './src/js/index.js',
	output: {
		filename: './js/index.js',
		path: path.resolve(__dirname, 'public'),
		assetModuleFilename: './[name][ext]',
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',
		}),
		new MiniCssExtractPlugin({
			filename: './css/style.css',
		}),
		new MinifyJsonPlugin(),
	],
	module: {
		rules: [
			{
				test: /\.html$/,
				use: ['html-loader'],
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
			},
			{
				test: /\.css$/i,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'postcss-loader',
				],
			},
			{
				test: /\.(jpe?g|webp|svg|gif)$/i,
				type: 'asset/resource',
				generator: {
					filename: './assets/images/[name][ext]',
				},
			},
			{
				test: /\.(png|ico)$/i,
				type: 'asset/resource',
				generator: {
					filename: './assets/favicons/[name][ext]',
				},
			},
		],
	},
	optimization: {
		minimizer: [
			'...',
			new CssMinimizerPlugin({
				minimizerOptions: {
					preset: [
						'default',
						{
							discardComments: {
								removeAll: true,
							},
						},
					],
				},
			}),
		],
	},
	devServer: {
		contentBase: path.join(__dirname, 'public'),
		compress: true,
		port: 9000,
	},
};
