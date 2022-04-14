const login = {
	params: {
		/**
		 * Google Signin Client ID
		 * @type	{String}
		 */
		gClientID: null,
		action: "login"
	},

	root: $("#app"),
	overlay: $("#overlay"),
	left: $("#left"),
	right: $("#right"),

	changing: false,

	/** @type {HTMLFormElement} */
	currentForm: undefined,
	
	/** @type {HTMLFormElement} */
	loginForm: undefined,
	
	/** @type {HTMLFormElement} */
	passwordRecoverForm: undefined,
	
	/** @type {HTMLFormElement} */
	registerStartForm: undefined,
	
	/** @type {HTMLFormElement} */
	registerMainForm: undefined,

	/** @type {HTMLDivElement} */
	container: undefined,

	init() {
		let logo = new lazyload({ source: "/static/img/logo.png", classes: "logo", tagName: "a" });
		logo.container.href = "/";
		this.initForms();

		this.container = makeTree("div", "container", {
			mainTitle: { tag: "div", class: ["title", "animated", "show"] },
			subTitle: { tag: "div", class: ["sub", "animated", "show"] },

			note: createNote({
				level: "warning",
				message: "sample warning",
				style: "round"
			}),

			forms: { tag: "div", class: "forms" }
		});

		// Setup form
		if (this.params.action === "register") {
			this.changeForm(this.registerStartForm, {
				title: "Đăng Kí",
				sub: `Nhập tên tài khoản mới mà bạn muốn đăng kí!<br>Tên tài khoản chỉ được phép chứa các kí tự tiếng anh và số!`,
				animated: false
			});
		} else {
			this.container.forms.appendChild(this.loginForm);
			this.changeForm(this.loginForm, {
				title: "Đăng Nhập",
				sub: `Để tiếp tục với <b>Vi2B</b>`,
				animated: false
			});
		}

		this.left.append(logo.container, this.container);
		this.reset();
	},

	initForms() {
		this.loginForm = makeTree("form", "loginForm", {
			usernameInput: createInput({
				type: "text",
				id: "username",
				label: "tên tài khoản",
				required: true,
				autofill: false,
				animated: true
			}),

			passwordInput: createInput({
				type: "password",
				id: "password",
				label: "mật khẩu",
				required: true,
				autofill: false,
				animated: true
			}),

			buttons: { tag: "div", class: "buttons", child: {
				submit: createButton("ĐĂNG NHẬP", {
					type: "submit",
					style: "round",
					icon: "signin",
					complex: true
				}),

				forgot: {
					tag: "button",
					type: "button",
					class: "textButton",
					text: "Quên Mật Khẩu?"
				}
			}},

			alternative: { tag: "div", class: "alternative", child: {
				register: createButton("Đăng Kí Tài Khoản Mới", {
					color: "purple",
					icon: "user",
					style: "round",
					complex: true,
					align: "right"
				})
			}}
		});

		this.loginForm.autocomplete = "off";
		this.loginForm.addEventListener("submit", () => this.login());
		this.loginForm.action = "javascript:void(0);";

		this.loginForm.buttons.forgot.addEventListener("click", () => {
			this.changeForm(this.passwordRecoverForm, {
				title: "Quên Mật Khẩu",
				sub: `Nhập địa chỉ email được liên kết với tài khoản của bạn`
			});
		});

		this.loginForm.alternative.register.addEventListener("click", () => {
			this.changeForm(this.registerStartForm, {
				title: "Đăng Kí",
				sub: `Nhập tên tài khoản mới mà bạn muốn đăng kí!<br>Tên tài khoản chỉ được phép chứa các kí tự tiếng anh và số!`
			});
		});


		//? ================= PASSWORD RECOVER FORM =================

		this.passwordRecoverForm = makeTree("form", "passwordRecoverForm", {
			usernameInput: createInput({
				type: "text",
				id: "email",
				label: "Email",
				required: true,
				autofill: false,
				animated: true
			}),

			buttons: { tag: "div", class: "buttons", child: {
				submit: createButton("GỬI", {
					type: "submit",
					style: "round",
					color: "pink",
					icon: "paperPlane",
					complex: true,
					align: "right",
					disabled: true
				}),

				cancel: {
					tag: "button",
					type: "button",
					class: "textButton",
					text: "Hủy"
				}
			}}
		});

		this.passwordRecoverForm.autocomplete = "off";
		this.passwordRecoverForm.addEventListener("submit", () => this.submit());
		this.passwordRecoverForm.action = "javascript:void(0);";
		this.passwordRecoverForm.buttons.cancel.addEventListener("click", () => this.activeLoginForm());


		//? ================= START REGISTER FORM =================

		this.registerStartForm = makeTree("form", "registerForm", {
			usernameInput: createInput({
				type: "text",
				id: "registerUsername",
				label: "tên tài khoản",
				required: true,
				autofill: false,
				animated: true
			}),
			
			buttons: { tag: "div", class: "buttons", child: {
				submit: createButton("TIẾP", {
					type: "submit",
					style: "round",
					color: "green",
					complex: true
				}),

				cancel: {
					tag: "button",
					type: "button",
					class: "textButton",
					text: "Đã Có Tài Khoản?"
				}
			}}
		});

		this.registerStartForm.autocomplete = "off";
		this.registerStartForm.addEventListener("submit", () => this.validateUsername());
		this.registerStartForm.action = "javascript:void(0);";
		this.registerStartForm.buttons.cancel.addEventListener("click", () => this.activeLoginForm());


		//? ================= MAIN REGISTER FORM =================

		this.registerMainForm = makeTree("form", "registerForm", {
			username: { tag: "input", type: "hidden", name: "username" },

			nameInput: createInput({
				type: "text",
				id: "registerName",
				label: "tên hiển thị",
				required: true,
				autofill: false,
				animated: true
			}),

			passwordInput: createInput({
				type: "password",
				id: "registerPassword",
				label: "mật khẩu",
				required: true,
				autofill: false,
				animated: true
			}),

			confirmPasswordInput: createInput({
				type: "password",
				id: "registerConfirmPassword",
				label: "nhập lại mật khẩu",
				required: true,
				autofill: false,
				animated: true
			}),
			
			buttons: { tag: "div", class: "buttons", child: {
				submit: createButton("ĐĂNG KÍ", {
					type: "submit",
					style: "round",
					color: "orange",
					complex: true
				}),

				cancel: {
					tag: "button",
					type: "button",
					class: "textButton",
					text: "Đã Có Tài Khoản?"
				}
			}}
		});

		this.registerMainForm.autocomplete = "off";
		this.registerMainForm.addEventListener("submit", () => this.register());
		this.registerMainForm.action = "javascript:void(0);";
		this.registerMainForm.buttons.cancel.addEventListener("click", () => this.activeLoginForm());
	},

	/**
	 * Focus into first visible input in a form.
	 * @param	{HTMLFormElement}	form
	 */
	focusFirstInput(form) {
		for (let input of form.elements) {
			if (input instanceof HTMLInputElement && input.type !== "hidden") {
				input.focus();
				break;
			}
		}
	},

	/**
	 * Switch to different form
	 * @param	{HTMLFormElement}		form
	 */
	async changeForm(form, {
		title,
		sub,
		animated = true
	}) {
		// Check what need to be changed
		if (form === this.currentForm || this.changing)
			return;
		
		this.changing = true;
		this.reset();

		let changeTitle = (title && this.container.mainTitle.innerText !== title);
		let changeSub = (sub && this.container.subTitle.innerText !== sub);

		if (!animated) {
			if (this.currentForm) {
				this.container.forms.removeChild(this.currentForm);
				this.currentForm.classList.remove("show", "hide");
			}

			if (changeTitle) {
				this.container.mainTitle.innerText = title;
				this.container.mainTitle.classList.remove("hide");
			}
	
			if (changeSub) {
				this.container.subTitle.innerHTML = sub;
				this.container.subTitle.classList.remove("hide");
			}

			this.container.forms.appendChild(form);
			await nextFrameAsync();

			this.container.forms.style.height = `${form.clientHeight}px`;
			form.classList.add("show");
			this.currentForm = form;
			
			this.changing = false;

			await delayAsync(600);
			this.focusFirstInput(form);
			return;
		}

		this.container.forms.appendChild(form);

		if (changeTitle)
			this.container.mainTitle.classList.add("hide");

		if (changeSub)
			this.container.subTitle.classList.add("hide");

		// Wait for browser to render next frame to update target
		// form's size.
		await nextFrameAsync();

		// Start animation
		if (this.currentForm)
			this.currentForm.classList.add("hide");

		await delayAsync(200);
		form.classList.add("show");
		this.container.forms.style.height = `${form.clientHeight}px`;

		await delayAsync(250);
		if (changeTitle) {
			this.container.mainTitle.innerText = title;
			this.container.mainTitle.classList.remove("hide");
		}

		if (changeSub) {
			this.container.subTitle.innerHTML = sub;
			this.container.subTitle.classList.remove("hide");
		}

		await delayAsync(100);
		if (this.currentForm) {
			this.currentForm.classList.remove("show", "hide");
			this.container.forms.removeChild(this.currentForm);
		}

		this.focusFirstInput(form);
		this.currentForm = form;
		this.changing = false;
	},

	activeLoginForm() {
		this.changeForm(this.loginForm, {
			title: "Đăng Nhập",
			sub: `Để tiếp tục với <b>Vi2B</b>`
		});
	},

	reset() {
		this.container.note.group.style.display = "none";
		this.loginForm.reset();
		this.registerStartForm.reset();
		this.registerMainForm.reset();
		this.passwordRecoverForm.reset();
		this.loading = false;
	},

	/**
	 * Set form loading state
	 * @param	{Boolean}	loading
	 */
	set loading(loading) {
		this.overlay.style.display = loading ? null : "none";
	},
	
	async login() {
		this.loginForm.buttons.submit.loading(true);
		disableInputs(this.loginForm);
		let username = this.loginForm.usernameInput.input.value;
		let password = this.loginForm.passwordInput.input.value;

		if (!/^[a-zA-Z0-9]+$/.test(username)) {
			this.loginForm.usernameInput.set({
				message: "Tên người dùng không hợp lệ!"
			});

			this.loginForm.buttons.submit.loading(false);
			return;
		}

		try {
			let response = await myajax({
				url: "/api/login",
				method: "POST",
				json: { username, password }
			});

			this.container.note.group.style.display = null;
			this.container.note.set({
				level: "okay",
				message: `Đăng nhập thành công! Đang chuyển hướng bạn tới trang chủ...`
			});

			console.log(response);
			location.href = "/";
		} catch(e) {
			this.loginForm.buttons.submit.loading(false);
			enableInputs(this.loginForm);

			// TODO: change code
			switch (e.data.status) {
				case 404:
					this.loginForm.usernameInput.input.value = "";
					this.loginForm.passwordInput.input.value = "";
					this.loginForm.usernameInput.input.focus();
					this.loginForm.usernameInput.set({
						message: `Tên người dùng không tồn tại trong hệ thống!`
					});
					break;
			
				case 403:
					this.loginForm.passwordInput.input.value = "";
					this.loginForm.passwordInput.input.focus();
					this.loginForm.passwordInput.set({
						message: `Mật khẩu không chính xác!`
					});
					break;

				default:
					this.container.note.group.style.display = null;
					this.container.note.set({ message: e.data.ExceptionMessage || e.data.description });
					break;
			}
		}
	},

	async validateUsername() {
		this.registerStartForm.buttons.submit.loading(true);
		this.registerStartForm.usernameInput.input.disabled = true;
		let username = this.registerStartForm.usernameInput.input.value;

		if (!/^[a-zA-Z0-9]+$/.test(username)) {
			this.registerStartForm.usernameInput.set({
				message: "Tên người dùng không hợp lệ!"
			});

			this.registerStartForm.usernameInput.input.disabled = false;
			this.registerStartForm.buttons.submit.loading(false);
			return;
		}

		try {
			await myajax({
				url: `/api/validate/${username}`,
				method: "GET"
			});

			// Switch to main register form.
			this.registerMainForm.username.value = username;
			this.changeForm(this.registerMainForm, {
				sub: `Nhập thông tin cho tài khoản mới của bạn. Tài khoản của bạn sẽ được đăng kí dưới tên người dùng <b>${username}</b>`
			});
		} catch(e) {
			// TODO: change code
			if (e.data.code === 403) {
				this.registerStartForm.usernameInput.set({
					message: e.data.description
				});

				this.registerStartForm.usernameInput.input.focus();
			} else {
				this.container.note.group.style.display = null;
				this.container.note.set({ message: e.data.ExceptionMessage || e.data.description });
			}
		}

		this.registerStartForm.buttons.submit.loading(false);
		this.registerStartForm.usernameInput.input.disabled = false;
	},

	async register() {
		this.registerMainForm.buttons.submit.loading(true);
		disableInputs(this.registerMainForm);

		let valid = true;
		let data = {
			username: this.registerMainForm.username.value.trim(),
			name: this.registerMainForm.registerName.value.trim(),
			password: this.registerMainForm.registerPassword.value.trim()
		}

		if (data.password !== this.registerMainForm.registerConfirmPassword.value) {
			this.registerMainForm.confirmPasswordInput.set({
				message: "Mật khẩu nhập lại không chính xác!"
			});

			valid = false;
		}

		if (valid) {
			this.loading = true;

			try {
				await myajax({
					url: "/api/register",
					method: "POST",
					json: data
				});

				this.container.note.group.style.display = null;
				this.container.note.set({
					level: "okay",
					message: `Đăng kí thành công! Đang chuyển hướng bạn tới trang chủ...`
				});

				location.href = "/";
			} catch(e) {
				this.container.note.group.style.display = null;
				this.container.note.set({ message: e.data.ExceptionMessage || e.data.description });
			}
			
			this.loading = false;
		}

		this.registerMainForm.buttons.submit.loading(false);
		enableInputs(this.registerMainForm);
	}
}

window.addEventListener("load", () => initGroup({ login }, "modules"));