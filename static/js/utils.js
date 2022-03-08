
class Video {
	/** @type {int?} */
	id;

	/** @type {string} */
	name;

	/** @type {string} */
	hash;

	/** @type {int} */
	length;

	/** @type {int} */
	created;

	/** @type {int} */
	views;

	/** @type {string} */
	description;

	/** @type {string} */
	videoType;

	/** @type {string} */
	thumbnailType;

	/** @type {bool} */
	uploaded;

	constructor(
		id,
		name,
		hash,
		length,
		created,
		views,
		description,
		videoType,
		thumbnailType,
		uploaded
	) {
		this.id = id;
		this.name = name;
		this.hash = hash;
		this.length = length;
		this.created = created;
		this.views = views;
		this.description = description;
		this.videoType = videoType;
		this.thumbnailType = thumbnailType;
		this.uploaded = uploaded;
	}

	getURL() {
		return `${location.origin}/watch?v=${this.hash}`;
	}

	getThumbURL() {
		return `${location.origin}/api/video/thumbnail/${this.hash}`;
	}

	/**
	 * Render Video Card
	 * @returns {HTMLSpanElement}
	 */
	render() {
		let length = parseTime(this.length);
		let uploaded = formatTime(time() - this.created, {
			now: "mới đây",
			minimal: true,
			surfix: " trước"
		});

		let node = makeTree("span", "videoCard", {
			thumb: { tag: "div", class: "thumb", child: {
				thumbnail: new lazyload({
					source: this.getThumbURL(),
					classes: "thumbnail"
				}),

				length: { tag: "span", class: "length", text: length.str }
			}},

			bottom: { tag: "div", class: "bottom", child: {
				avatar: new lazyload({
					source: `/static/img/avatar.svg`,
					classes: "avatar"
				}),

				details: { tag: "span", class: "details", child: {
					videoName: { tag: "div", class: "name", text: this.name },
					channel: { tag: "a", class: "channel", text: "Admin" },
					metadata: { tag: "div", class: "metadata", child: {
						views: { tag: "span", class: "views", text: `${this.views} lượt xem` },
						dot: { tag: "dot" },
						uploaded: { tag: "span", class: "uploaded", text: uploaded }
					}}
				}}
			}}
		});

		
		return node;
	}

	renderList() {

	}

	async save() {
		await myajax({
			url: `/api/video/update`,
			method: "POST",
			json: {
				id: this.id,
				hash: this.hash,
				name: this.name,
				description: this.description
			}
		});
	}

	async getVideo(id) {
		let response = await myajax({
			url: `/api/video/${id}`,
			method: "GET"
		});

		return Video.processResponse(response);
	}

	/**
	 * Process response data from API
	 * @param {Object} response
	 */
	static processResponse(response) {
		return new Video(
			response.id,
			response.name,
			response.hash,
			response.length,
			response.created,
			response.views,
			response.description,
			response.videoType,
			response.thumbnailType,
			response.uploaded
		);
	}
}