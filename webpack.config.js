const config = {
	mode: 'production',
	entry: {
		index: './src/js/main.js'
	},
	output: {
		filename: 'main.js',
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
		],
	},
};

module.exports = config;
