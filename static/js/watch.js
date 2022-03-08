
const watch = {
	container: $("#app"),

	/** @type {HTMLDivElement} */
	view: undefined,

	/** @type {VideoJS} */
	videoJS: undefined,

	/** @type {Video} */
	video: undefined,
	
	/** @type {Video[]} */
	next: undefined,

	async init() {
		let params = new URLSearchParams(location.search);

		if (!params.has("v")) {
			location.href = "/";
			return false;
		}

		let hash = params.get("v");

		try {
			this.video = await Video.getByHash(hash);
			this.next = await Video.getAllVideos();
		} catch(e) {
			this.log("ERRR", e);
			location.href = "/";
			return false;
		}

		this.view = makeTree("div", "view", {
			main: { tag: "span", class: "main", child: {
				player: { tag: "div", class: "player" },

				name: { tag: "div", class: "name", text: this.video.name },
				info: { tag: "div", class: "info", child: {
					meta: { tag: "span", class: "meta", child: {
						views: { tag: "span", class: "views", text: `${this.video.views} lượt xem` },
						dot: { tag: "dot" },

						uploaded: {
							tag: "span",
							class: "uploaded",
							text: humanReadableTime(new Date(this.video.created * 1000), {
								onlyDate: true
							})
						}
					}},

					menu: { tag: "span", class: "menu", child: {
						likes: { tag: "span", class: "likes", child: {
							like: { tag: "span", class: "like", child: {
								icon: { tag: "icon", data: { icon: "thumbUp" } },
								value: { tag: "span", class: "value", text: "0" }
							}},

							dislike: { tag: "span", class: "dislike", child: {
								icon: { tag: "icon", data: { icon: "thumbDown" } },
								value: { tag: "span", class: "value", text: "0" }
							}},

							ratio: { tag: "div", class: "ratio", child: {
								bar: { tag: "div", class: "bar" }
							}}
						}},

						share: { tag: "span", class: ["button", "share"], child: {
							icon: { tag: "icon", data: { icon: "share" } },
							value: { tag: "span", class: "value", text: "CHIA SẺ" }
						}}
					}}
				}},

				author: { tag: "div", class: "author", child: {
					top: { tag: "div", class: "top", child: {
						channel: { tag: "span", class: "channel", child: {
							avatar: new lazyload({ source: `/static/img/avatar.svg`, classes: "avatar" }),

							info: { tag: "span", class: "info", child: {
								name: { tag: "div", class: "name", text: "Admin" },
								subs: { tag: "div", class: "subs", text: "0 người đăng kí" }
							}}
						}},

						buttons: { tag: "span", class: "buttons", child: {
							subscribe: createButton("ĐĂNG KÍ", {
								color: "red",
								style: "round",
								complex: true
							})
						}}
					}},

					description: { tag: "div", class: "description", text: this.video.description }
				}}
			}},

			next: { tag: "span", class: "next" }
		});

		this.videoJS = new VideoJS(this.view.main.player);
		this.videoJS.setup({
			src: this.video.getVideoURL(),
			autoPlay: true
		});

		emptyNode(this.container);

		for (let item of this.next)
			this.view.next.appendChild(item.renderList());

		this.container.appendChild(this.view);
	}
}

window.addEventListener("load", () => initGroup({ watch }, "modules"));