
const index = {
	container: $("#app"),

	/** @type {HTMLDivElement} */
	view: $("#app > .videos"),

	/** @type {Video[]} */
	videos: undefined,

	async init() {
		new Scrollable(this.container, { content: this.view });
	}
}

window.addEventListener("load", () => initGroup({ index }, "modules"));