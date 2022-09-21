# form.js

> light-weight library for form validation.

# Depencies

[set.js](https://github.com/sylezenwata/set.git)

# Install

As module

```javascript
import form from "form";
```

In the browser

```html
<script type="text/javascript" src="dist/form.min.js"></script>
```

# Usage

```javascript
const options = {
	regex: {
		// regex for required inputs
		// with jsname as key
		password: /^(.+)$/,
	},
	errorTag: {
		partA: `<div class="form-input-error" data-form-input-error><span>`,
		partB: `</span></div>`,
	},
};
const _form = new form(options).init();
```
