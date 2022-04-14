/**
 * form.js 1.2.0
 * MIT License
 * Copyright (c) 2021 sylvester ezenwata
 * https://github.com/sylezenwata/form.git
 *
 * @dependency "github:sylezenwata/set"
 */

"use strict";

class form {
	constructor(init) {
		// val if set.js is import
		if (!window.set) {
			throw new Error(
				`form.js depends on set.js (https://github.com/sylezenwata/set.js)`
			);
		}
		// access set function
		if ("function" !== typeof set && set.hasOwnProperty("__esModule")) {
			set = set.set;
		}

		// Initial basic data
		this.formSelector = "form[data-jsvalidate]";
		this.fieldsRequiredSelector = "[jsrequired]";
		this.fieldsWithPlaceholder = "[jsplaceholder]";
		this.fieldsSwitchSelector = "[jstypeswitch]";
		this.swithBtnSelector = "[data-switch-btn]";
		this.dataFieldsType = [
			"input:not([type='submit']):not([type='button'])",
			"select",
			"textarea",
		];
		this.regex = {
			email:
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			phone: /^([0])([7]|[8]|[9])([\d]){9}$/,
			password:
				/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,20}$/,
			default: /(.+)/,
		};

		// update init data
		if (init && "object" === typeof init) {
			Object.keys(init).forEach((e) => {
				if (this.hasOwnProperty(e)) {
					if (Array.isArray(this[e])) {
						this[e] = [...new Set(this[e].concat(init[e]))];
					} else if ("object" === typeof this[e]) {
						Object.assign(this[e], init[e]);
					} else {
						this[e] = init[e];
					}
				}
			});
		}

		// validated forms
		this.validatedForms = {};
	}

	/**
	 * function to initialize Form action
	 */
	init() {
		this.observeFields();
		this.observeFieldsToSwitch();
		this.observeFormSubmit();
		return this;
	}

	/**
	 * function to validate fie
	 * @param {Array|NodeList|Node} fields
	 * @returns {Boolean}
	 */
	validateFields(fields) {
		if (!Array.isArray(fields) && !(fields instanceof NodeList)) {
			fields = [fields];
		}

		let errors = [];

		fields.forEach((eachField) => {
			const eachFieldName = set(eachField).attr("jsname")[0];
			const eachFieldValue = /^(span|div)$/.test(
				eachField.nodeName.toLowerCase()
			)
				? eachField.innerText
				: eachField.value;
			const parentWrap = set(eachField).parent("[data-content]");

			// val field value against jsname regex
			const regex = this.regex[eachFieldName]
				? this.regex[eachFieldName]
				: this.regex.default;
			if (!regex.test(eachFieldValue.trim())) {
				parentWrap.data("error", "true");
				if (!parentWrap.find("[data-form-input-error]")[0]) {
					parentWrap.append(
						this.createFormInputError(
							`Invalid ${set(eachField)
								.attr("jsvalidate")[0]
								.split("+")
								.join(" or ")}`
						)
					);
				}
				errors.push(eachFieldName);
			} else {
				parentWrap.data("error", "false");
				parentWrap.remove("[data-form-input-error]");
			}

			this.setHasContent(eachField, eachFieldValue, parentWrap);
		});

		return errors.length === 0;
	}

	/**
	 * function to show form field error
	 * @param errorInfo
	 */
	createFormInputError(errorInfo) {
		return `<div class="form-input-error" data-form-input-error><svg class="form-input-error-icon" focusable="false" width="16px" height="16px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg><span>${errorInfo}</span></div>`;
	}

	/**
	 * function to check update data-content attr for fields with jsplaceholder
	 * @param {Node} field
	 * @param {String} value
	 */
	setHasContent(field, value, parentWrap) {
		if (set(field).attr(this.fieldsWithPlaceholder.replace(/[\[\]]/g, ""))[0]) {
			if (value.trim() !== "") {
				parentWrap.data("content", "true");
			} else {
				parentWrap.data("content", "false");
			}
		}
	}

	/**
	 * function to observe required fields
	 */
	observeFields() {
		set(document).on(
			"blur",
			`${this.formSelector} ${this.fieldsRequiredSelector}`,
			(e) => this.validateFields(e.target),
			true
		);
	}

	/**
	 * function to observe fields with switch btn
	 */
	observeFieldsToSwitch() {
		set(document).on(
			"click",
			`${this.swithBtnSelector}`,
			(e) => {
				const field = set(e.target).sibling(this.fieldsSwitchSelector);
				const currentType = field.attr("type")[0];
				field[0].type = field.attr(this.fieldsSwitchSelector)[0];
				field.attr(this.fieldsSwitchSelector, currentType);
			},
			true
		);
	}

	/**
	 * function to observe forms to validate before submission
	 */
	observeFormSubmit() {
		set(document).on(
			"submit",
			`${this.formSelector}`,
			(e) => {
				const form = e.target;
				let formId = form.id;
				if (!formId) {
					formId = this.genDynamicId(form);
					form.id = formId;
				}
				if (
					!this.validateFields(set(form).find(this.fieldsRequiredSelector)[0])
				) {
					e.preventDefault();
					this.validatedForms[formId] = false;
				} else {
					this.validatedForms[formId] = true;
				}
			},
			true
		);
	}

	/**
	 * function to generate dynamic id
	 * @param {Node} form
	 * @returns {String}
	 */
	genDynamicId(form) {
		let formIndex = set(this.formSelector).map((e, i) => {
			if (e === form) {
				return `${i}`;
			}
		})[0];
		return formIndex + Math.floor(Math.random() * 10e8);
	}

	/**
	 * function to clear form data
	 * @param {String|Node} formSelector
	 * @param {Array|null} dataFieldsSelector
	 */
	reset(formSelector, dataFieldsSelector) {
		dataFieldsSelector = dataFieldsSelector
			? dataFieldsSelector.join()
			: this.dataFieldsType.join();

		const fields = set(formSelector).find(dataFieldsSelector)[0];

		fields.forEach((eachField) => {
			if (/^(span|div)$/.test(eachField.nodeName.toLowerCase())) {
				eachField.innerText = "";
			} else {
				eachField.value = "";
			}
			set(eachField).parent("[data-content]").data("content", "false");
		});
	}

	/**
	 * function to get form data
	 * @param {String} formSelector
	 * @param {String} format - 'formdata' is default
	 * @param {Array} exemptedFileds
	 * @returns
	 */
	formData(formSelector, format, exemptedFileds) {
		const validFormats = ["url", "formdata", "json"];

		if (
			"string" === typeof format &&
			!validFormats.some((e) => e.toLowerCase() === format?.toLowerCase())
		) {
			throw new Error(`Valid formats are ${validFormats.join(" or ")}`);
		}

		let formData = new FormData(set(formSelector)[0]);

		if (
			exemptedFileds &&
			[...formData.keys].some((e) => exemptedFileds.includes(e))
		) {
			exemptedFileds.forEach((exemption) => {
				if ([...formData.keys].some((e) => e === exemption)) {
					formData.delete(exemption);
				}
			});
		}

		if (format?.toLowerCase() === "url") {
			return [...formData.entries()]
				.map((entry) => {
					let [key, value] = entry;
					return `${key}=${value}`;
				})
				.join();
		}

		if (format?.toLowerCase() === "json") {
			return [...formData.entries()].reduce((obj, entry) => {
				let [key, value] = entry;
				obj[key] = value;
				return obj;
			}, {});
		}

		return formData;
	}
}

export { form };
