set = set.set;

const options = {
	regex: {
		identifie: /^(.+)$/,
		password: /^(.+)$/,
		contactChannel: /^(.+)$/,
	},
	errorTag: {
		partA: `<div class="form-input-error" data-form-input-error><span>`,
		partB: `</span></div>`,
	},
};
const _form = new form.form(options).init();
// _form.init()

set("form").on("submit", function (e) {
	// if (_form.validatedForms[])
	if (_form.validatedForms[this.id]) {
		e.preventDefault();
		set(this).disableForm();
		set
			.ajax({
				url: "https://jsonplaceholder.typicode.com/posts",
				method: "POST",
				body: _form.formData(this),
				headers: {
					"Content-Type": false,
				},
			})
			.then((e) => {
				set(set(this).find(".form-header")[0][0]).append(`<p>${e}</p>`);
				this.reset();
			})
			.catch((e) => console.log(e))
			.finally(() => set(this).disableForm(true));
	}
});
