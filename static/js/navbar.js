
const navbar = {
	/** @type {HTMLElement} */
	container: undefined,

	menuShowing: false,

	init() {
		this.container = makeTree("nav", "navbar", {
			underlay: { tag: "div", class: "underlay" },

			left: { tag: "span", class: "left", child: {
				logo: new lazyload({ source: "/static/img/logo.png", classes: "logo" })
			}},

			right: { tag: "span", class: "right", child: {
				upload: { tag: "icon", data: { icon: "upload" } },
				profile: { tag: "span", class: "profile", child: {
					displayName: { tag: "span", class: "name", text: "Admin" },
					avatar: new lazyload({ source: "/static/img/avatar.svg", classes: "avatar" })
				}},

				menu: { tag: "div", class: "menu", child: {
					header: { tag: "a", class: ["item", "header"], child: {
						left: { tag: "div", class: "left", child: {
							avatar: new lazyload({ source: "/static/img/avatar.svg", classes: "avatar" })
						}},

						right: { tag: "div", class: "right", child: {
							headTitle: { tag: "div", class: "title", text: "Admin" },
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
			}}
		});

		this.addMenuItem({ name: "Đăng Xuất", icon: "signout" });
		let original = $("#navbar");

		this.container.id = "navbar";
		this.container.underlay.addEventListener("click", () => this.hideMenu());
		this.container.right.profile.addEventListener("click", () => this.toggleMenu());
		original.parentElement.replaceChild(this.container, original);
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
		this.container.right.menu.insertBefore(
			item,
			this.container.right.menu.sep.nextSibling);
		
		return item;
	},

	toggleMenu() {
		if (this.menuShowing)
			this.hideMenu();
		else
			this.showMenu();
	},

	showMenu() {
		this.container.right.menu.classList.add("show");
		this.container.underlay.classList.add("show");
		this.menuShowing = true;
	},

	hideMenu() {
		this.container.right.menu.classList.remove("show");
		this.container.underlay.classList.remove("show");
		this.menuShowing = false;
	}
}

window.addEventListener("load", () => initGroup({ navbar }, "modules"));