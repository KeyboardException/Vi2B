
const navbar = {
	original: $("#navbar"),

	/** @type {HTMLElement} */
	container: undefined,
	
	menuShowing: false,
	
	/** @type {HTMLElement} */
	right: undefined,

	/** @type {Session} */
	session: undefined,

	async init() {
		if (!this.original)
			return false;

		this.container = makeTree("nav", "navbar", {
			underlay: { tag: "div", class: "underlay" },

			left: { tag: "span", class: "left", child: {
				logo: new lazyload({
					source: "/static/img/logo.png",
					classes: "logo",
					tagName: "a"
				})
			}}
		});

		this.container.id = "navbar";
		this.container.left.logo.container.href = "/";
		this.original.parentElement.replaceChild(this.container, this.original);

		try {
			let response = await myajax({
				url: "/api/session",
				method: "GET"
			});

			this.session = Session.processResponse(response.data);

			this.right = makeTree("span", "right", {
				upload: { tag: "a", href: "/upload", child: {
					icon: { tag: "icon", data: { icon: "upload" } },
				}},

				profile: { tag: "span", class: "profile", child: {
					displayName: { tag: "span", class: "name", text: this.session.user.name },
					avatar: new lazyload({ source: this.session.user.getAvatar(), classes: "avatar" })
				}},

				menu: { tag: "div", class: "menu", child: {
					header: { tag: "a", class: ["item", "header"], child: {
						left: { tag: "div", class: "left", child: {
							avatar: new lazyload({ source: this.session.user.getAvatar(), classes: "avatar" })
						}},

						right: { tag: "div", class: "right", child: {
							headTitle: { tag: "div", class: "title", text: this.session.user.name },
							sub: { tag: "div", class: "sub", text: "Kênh của bạn" }
						}}
					}},

					sep: { tag: "hr" },

					footer: {
						tag: "div",
						class: "footer",
						html: "(C) 2022 Team KeyboardException | <a>About Us</a> | <a>Github</a>"
					}
				}}
			});

			this.container.appendChild(this.right);
			this.container.underlay.addEventListener("click", () => this.hideMenu());
			this.right.profile.addEventListener("click", () => this.toggleMenu());

			this.addMenuItem({ name: "Đăng Xuất", icon: "signout", link: "/logout" });
		} catch(e) {
			// Prob not logged in

			this.right = makeTree("span", "right", {
				login: { tag: "button", class: "text-btn", href: "/login", text: "ĐĂNG NHẬP" }
			});

			this.right.login.addEventListener("click", () => location.href = "/login");
			this.container.appendChild(this.right);
		}
	},

	addMenuItem({ name, icon, link, sub } = {}) {
		let item = makeTree("a", "item", {
			left: { tag: "div", class: "left", child: {
				icon: { tag: "icon", data: { icon } }
			}},

			right: { tag: "div", class: "right", child: {
				itemTitle: { tag: "div", class: "title", text: name },
				...(sub ? { sub: { tag: "div", class: "sub", text: sub } } : {})
			}}
		});

		item.href = link || "#";
		this.right.menu.insertBefore(
			item,
			this.right.menu.sep.nextSibling);
		
		return item;
	},

	toggleMenu() {
		if (this.menuShowing)
			this.hideMenu();
		else
			this.showMenu();
	},

	showMenu() {
		this.right.menu.classList.add("show");
		this.container.underlay.classList.add("show");
		this.menuShowing = true;
	},

	hideMenu() {
		this.right.menu.classList.remove("show");
		this.container.underlay.classList.remove("show");
		this.menuShowing = false;
	}
}

window.addEventListener("load", () => initGroup({ navbar }, "modules"));