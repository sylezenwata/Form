import set from "../node_modules/set/src/index.js";
import form from "../src/index.js";

globalThis.set = set;

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

const _form = new form(options).init();

set("form").on("submit", function (e) {
	if (_form.validatedForms[this.id]) {
		e.preventDefault();
		const body = _form.formData(this);
		set(this).disableForm();
		set
			.ajax({
				url: "https://jsonplaceholder.typicode.com/posts",
				method: "POST",
				body,
				headers: {
					"Content-Type": false,
					Accept: false,
				},
				// responseType: "json",
				withCredentials: false,
			})
			.then((e) => {
				set(set(this).find(".form-header")[0][0]).append(`<p>${e}</p>`);
				this.reset();
			})
			.catch((e) => console.log(e))
			.finally(() => set(this).disableForm(true));
	}
});
