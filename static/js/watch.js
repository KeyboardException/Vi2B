
const watch = {
	container: $("#app"),
	actions: $("#VideoActions"),

	/** @type {VideoJS} */
	videoJS: undefined,

	/** @type {Video} */
	video: undefined,
	
	/** @type {Video[]} */
	next: undefined,

	/** @type {HTMLButtonElement} */
	deleteButton: undefined,

	/** @type {HTMLButtonElement} */
	editButton: undefined,

	/** @type {HTMLButtonElement} */
	subscribeButton: undefined,

	async init() {
		popup.init();
		let params = new URLSearchParams(location.search);

		if (!params.has("v")) {
			location.href = "/";
			return false;
		}

		let hash = params.get("v");

		try {
			this.video = await Video.getByHash(hash);
		} catch(e) {
			this.log("ERRR", e);
			location.href = "/";
			return false;
		}

		this.videoJS = new VideoJS($("#VideoPlayer"));
		this.videoJS.setup({
			src: this.video.getVideoURL(),
			autoPlay: true
		});

		if (navbar.session) {
			this.deleteButton = createButton("", {
				color: "pink",
				style: "round",
				complex: true,
				icon: "trash"
			});
	
			this.editButton = createButton("", {
				color: "blue",
				style: "round",
				complex: true,
				icon: "pencil",
				disabled: true
			});

			this.deleteButton.addEventListener("click", () => this.delete());
			this.actions.append(this.deleteButton, this.editButton);
		}

		this.subscribeButton = createButton("ĐĂNG KÍ", {
			color: "red",
			style: "round",
			classes: "subscribe",
			complex: true
		});

		this.actions.append(this.subscribeButton);

		new Scrollable(this.container, { content: this.container.firstElementChild });
		this.container.appendChild(this.view);
	},

	async delete() {
		let confirm = await popup.show({
			windowTitle: `Xóa ${this.video.hash}`,
			title: "Xác Nhận",
			icon: "trash",
			message: `${this.video.name}`,
			description: "Bạn có chắc muốn xóa video này không?",
			note: "Hành động này không thể hoàn tác một khi đã thực hiện!",
			noteLevel: "warning",
			buttonList: {
				confirm: { text: "XÓA!", color: "red" },
				cancel: { text: "thôi, nghĩ lại rùi 😁", color: "brown" }
			}
		});

		if (confirm !== "confirm")
			return;

		this.deleteButton.loading(true);

		try {
			await this.video.delete();
		} catch(e) {
			errorHandler(e);
		}

		this.deleteButton.loading(false);
		location.href = "/";
	}
}

window.addEventListener("load", () => initGroup({ watch }, "modules"));