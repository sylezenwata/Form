const options = {
	regex: {
		identifie: /^(.+)$/,
		password: /^(.+)$/,
	},
};
const _form = new form.form(options).init();
// _form.init()

set("form").on("submit", function (e) {
	// if (_form.validatedForms[])
	if (_form.validatedForms[this.id]) {
		e.preventDefault();
		console.log(_form.formData(this, "json"));
	}
});
