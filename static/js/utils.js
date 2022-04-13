
class Video {
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

	getVideoURL() {
		return `${location.origin}/api/video/fetch/${this.hash}`;
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
					classes: "thumbnail",
					tagName: "a"
				}),

				length: { tag: "span", class: "length", text: length.str }
			}},

			bottom: { tag: "div", class: "bottom", child: {
				avatar: new lazyload({
					source: `/static/img/avatar.svg`,
					classes: "avatar"
				}),

				details: { tag: "span", class: "details", child: {
					videoName: { tag: "a", class: "name", text: this.name },
					channel: { tag: "a", class: "channel", text: "Admin" },

					metadata: { tag: "div", class: "metadata", child: {
						views: { tag: "span", class: "views", text: `${this.views} lượt xem` },
						dot: { tag: "dot" },
						uploaded: { tag: "span", class: "uploaded", text: uploaded }
					}}
				}}
			}}
		});

		node.thumb.thumbnail.container.href = this.getURL();
		node.bottom.details.videoName.href = this.getURL();
		return node;
	}

	/**
	 * Render Video List
	 * @returns {HTMLSpanElement}
	 */
	renderList() {
		let length = parseTime(this.length);
		let uploaded = formatTime(time() - this.created, {
			now: "mới đây",
			minimal: true,
			surfix: " trước"
		});

		let node = makeTree("span", "videoList", {
			thumb: { tag: "div", class: "thumb", child: {
				thumbnail: new lazyload({
					source: this.getThumbURL(),
					classes: "thumbnail",
					tagName: "a"
				}),

				length: { tag: "span", class: "length", text: length.str }
			}},

			right: { tag: "div", class: "right", child: {
				videoName: { tag: "a", class: "name", text: this.name },
				channel: { tag: "a", class: "channel", text: "Admin" },

				metadata: { tag: "div", class: "metadata", child: {
					views: { tag: "span", class: "views", text: `${this.views} lượt xem` },
					dot: { tag: "dot" },
					uploaded: { tag: "span", class: "uploaded", text: uploaded }
				}}
			}}
		});

		node.thumb.thumbnail.container.href = this.getURL();
		node.right.videoName.href = this.getURL();
		return node;
	}

	async save() {
		await myajax({
			url: `/api/video/update`,
			method: "POST",
			json: {
				hash: this.hash,
				name: this.name,
				description: this.description
			}
		});
	}

	async delete() {
		await myajax({
			url: `/api/video/${this.hash}`,
			method: "DELETE"
		});
	}

	/**
	 * Update new thumbnail
	 * @param {Blob|File} thumbnail 
	 */
	async updateThumb(thumbnail) {
		await myajax({
			url: `/api/video/thumbnail/${this.hash}`,
			method: "POST",
			form: { thumbnail }
		});
	}

	/**
	 * Get video with specified ID
	 * @param	{Number}	id 
	 * @returns {Promise<Video>}
	 */
	static async getVideo(id) {
		let response = await myajax({
			url: `/api/video/id/${id}`,
			method: "GET"
		});

		return Video.processResponse(response);
	}

	/**
	 * Get video with specified Hash
	 * @param	{String}	hash
	 * @returns {Promise<Video>}
	 */
	static async getByHash(hash) {
		let response = await myajax({
			url: `/api/video/${hash}`,
			method: "GET"
		});

		return Video.processResponse(response);
	}

	/**
	 * Get all videos
	 * @returns {Promise<Video[]>}
	 */
	static async getAllVideos() {
		let response = await myajax({
			url: `/api/videos`,
			method: "GET"
		});

		let videos = Array();

		for (let item of response)
			videos.push(Video.processResponse(item));

		return videos;
	}

	/**
	 * Process response data from API
	 * @param {Object} response
	 */
	static processResponse(response) {
		return new Video(
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

/**
 * Disable all input inside a form
 * @param	{HTMLFormElement}		form
 */
 function disableInputs(form) {
	for (let input of form.elements) {
		if (input instanceof HTMLInputElement)
			input.disabled = true;
	}
}

/**
 * Enable all input inside a form
 * @param	{HTMLFormElement}		form
 */
function enableInputs(form) {
	for (let input of form.elements) {
		if (input instanceof HTMLInputElement)
			input.disabled = false;
	}
}