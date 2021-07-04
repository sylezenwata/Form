module.exports = {
    mode: "production",
    output: {
        path: `${__dirname}/dist`,
        library: 'FORM',
        libraryTarget: 'umd',
        filename: 'form.min.js',
        auxiliaryComment: 'Test Comment',
        environment: {
			arrowFunction: false
		},
    },
};