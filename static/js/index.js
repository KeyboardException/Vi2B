
const index = {
	container: $("#app"),

	/** @type {HTMLDivElement} */
	view: undefined,

	/** @type {Video[]} */
	videos: undefined,

	async init() {
		this.view = makeTree("div", ["videos", "cap-width"], {
			content: { tag: "div", class: "content" }
		});
		
		this.videos = await Video.getAllVideos();
		emptyNode(this.container);
		new Scrollable(this.container, { content: this.view });

		for (let video of this.videos)
			this.view.content.appendChild(video.render());

		this.container.appendChild(this.view);
	}
}

window.addEventListener("load", () => initGroup({ index }, "modules"));