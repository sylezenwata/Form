module.exports = {
    mode: "production",
    entry: `${__dirname}/src/index.js`,
    output: {
        path: `${__dirname}/dist`,
        filename: 'form.min.js',
        library: {
            name: 'form',
            type: 'umd',
        },
        // auxiliaryComment: 'Test Comment',
        environment: {
			arrowFunction: false
		},
    },
};