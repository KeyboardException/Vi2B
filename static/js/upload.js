
const upload = {
	container : $("#app"),

	/** @type {HTMLDivElement} */
	main: undefined,

	/** @type {HTMLDivElement} */
	uploadProgress: undefined,

	/** @type {HTMLDivElement} */
	uploadForm: undefined,
	
	/** @type {HTMLFormElement} */
	updateForm: undefined,

	/** @type {HTMLElement} */
	activeForm: undefined,

	/** @type {HTMLElement} */
	completeForm: undefined,

	/** @type {HTMLElement} */
	finishForm: undefined,

	/** @type {HTMLElement} */
	activeStep: undefined,

	/** @type {File} */
	video: undefined,

	/** @type {Boolean} */
	changing: false,

	uploaded: false,
	updated: false,

	/** @type {Video} */
	record: undefined,

	init() {
		emptyNode(this.container);
		this.setup();

		this.container.append(this.uploadProgress, this.main);
		this.show(this.uploadForm, this.main.content.headers.upload, false);
	},

	setup() {
		this.uploadForm = makeTree("div", ["form", "upload"], {
			input: { tag: "input", type: "file", id: "videoInput" },

			icon: { tag: "icon", data: { icon: "upload2" } },
			titleNode: { tag: "div", class: "title", text: "Kéo và thả video vào đây để tải lên" },
			sub: { tag: "div", class: "sub", text: "Video của bạn sẽ được công khai một khi đã tải lên." },
			notice: { tag: "div", class: "notice", text: "File bạn vừa chọn không phải là một video hợp lệ!" },

			choose: createButton("CHỌN TỆP", {
				type: "input",
				element: "label",
				style: "round",
				icon: "file",
				align: "right",
				classes: "choose",
				complex: true
			})
		});

		this.uploadForm.addEventListener("dragenter", (e) => {
			e.stopPropagation();
			e.preventDefault();
			this.uploadForm.classList.add("drag");
		});

		this.uploadForm.addEventListener("dragleave", (e) => {
			e.stopPropagation();
			e.preventDefault();
			this.uploadForm.classList.remove("drag");
		});

		this.uploadForm.addEventListener("dragover", (e) => {
			e.stopPropagation();
			e.preventDefault();
			e.dataTransfer.dropEffect = "copy";
			this.uploadForm.classList.add("drag");
		});

		this.uploadForm.choose.htmlFor = "videoInput";
		this.uploadForm.addEventListener("drop", (e) => this.handleDrop(e));
		this.uploadForm.input.addEventListener("change", (e) => this.handleDrop(e));


		this.updateForm = makeTree("form", ["form", "update"], {
			left: { tag: "span", class: "left", child: {
				titleInput: createInput({
					type: "text",
					id: "videoTitle",
					label: "Tiêu Đề",
					autofill: false,
					animated: true,
					required: true
				}),
	
				description: createInput({
					type: "textarea",
					id: "videoDescription",
					label: "Mô Tả",
					autofill: false,
					animated: true
				}),
	
				buttons: { tag: "div", class: "buttons", child: {
					submit: createButton("LƯU THÔNG TIN", {
						type: "submit",
						color: "blue",
						style: "round",
						classes: "submit",
						complex: true
					})
				}}
			}},

			right: { tag: "div", class: "right", child: {
				thumbnail: createImageInput({ id: "thumbnail" }),

				link: { tag: "div", class: "item", child: {
					label: { tag: "div", class: "label", text: "Đường liên kết của video" },
					value: { tag: "a", class: "value", text: "" }
				}},

				filename: { tag: "div", class: "item", child: {
					label: { tag: "div", class: "label", text: "Tên tệp" },
					value: { tag: "div", class: "value", text: "" }
				}},

				size: { tag: "div", class: "item", child: {
					label: { tag: "div", class: "label", text: "Kích cỡ" },
					value: { tag: "div", class: "value", text: "---MB" }
				}}
			}}
		});

		this.updateForm.autocomplete = "off";
		this.updateForm.addEventListener("submit", () => this.onUpdate());
		this.updateForm.action = "javascript:void(0);";


		this.completeForm = makeTree("div", ["form", "complete"], {
			icon: { tag: "icon", data: { icon: "upload" } },
			titleNode: { tag: "div", class: "title", text: "Cập Nhật Thông Tin Thành Công!" },
			sub: { tag: "div", class: "sub", text: "Video của bạn vẫn đang được tải lên, vui lòng không tắt trình duyệt trong quá trình này!" }
		});


		this.finishForm = makeTree("div", ["form", "finish"], {
			icon: { tag: "icon", data: { icon: "check" } },
			titleNode: { tag: "div", class: "title", text: "Tải Lên Video Thành Công!" },
			sub: { tag: "div", class: "sub", text: "Bạn hiện đã có thể xem video của mình!" }
		});


		this.uploadProgress = makeTree("div", ["cap-width", "progress"], {
			content: { tag: "div", class: "content", child: {
				icon: { tag: "icon", data: { icon: "upload" } },
				bar: { tag: "span", class: "progressBar", data: { style: "round" }, child: {
					left: { tag: "span", class: "left", text: "00" },
					right: { tag: "span", class: "right", child: {
						timeleft: { tag: "span", class: "timeleft", text: "Không Rõ" },
						uploaded: { tag: "span", class: "uploaded", text: "Đang Khởi Tạo" }
					}},

					bar: { tag: "div", class: "bar" }
				}}
			}}
		});

		this.main = makeTree("div", ["cap-width", "main"], {
			content: { tag: "div", class: "content", child: {
				headers: { tag: "div", class: "headers", child: {
					upload: { tag: "span", class: ["step", "upload"], text: "Chọn File Video" },
					arrow1: { tag: "icon", data: { icon: "arrowRight" } },
					update: { tag: "span", class: ["step", "update"], text: "Cập Nhật Thông Tin" },
					arrow2: { tag: "icon", data: { icon: "arrowRight" } },
					complete: { tag: "span", class: ["step", "update"], text: "Hoàn Thành" }
				}},

				forms: { tag: "div", class: "forms" }
			}}
		});
	},

	showProgress() {
		this.container.classList.add("showProgress");
		this.setProgress(0, "---", "Đang Xử Lí");
	},

	setProgress(progress, timeleft, size) {
		if (progress < 0) {
			this.uploadProgress.content.icon.classList.add("errored");
			this.uploadProgress.content.bar.bar.dataset.color = "red";
			this.uploadProgress.content.bar.left.innerText = "ERROR";
		} else if (progress >= 100) {
			this.uploadProgress.content.icon.classList.add("completed");
			this.uploadProgress.content.bar.bar.style.width = `100%`;
			this.uploadProgress.content.bar.left.innerText = 100;
			this.uploadProgress.content.bar.bar.dataset.color = "green";
		} else {
			this.uploadProgress.content.icon.classList = [];
			this.uploadProgress.content.bar.bar.style.width = `${progress}%`;
			this.uploadProgress.content.bar.left.innerText = progress.toFixed(0);
			this.uploadProgress.content.bar.bar.dataset.color = "blue";
		}

		if (typeof timeleft === "string")
			this.uploadProgress.content.bar.right.timeleft.innerText = timeleft;
		
		if (typeof size === "string")
			this.uploadProgress.content.bar.right.uploaded.innerText = size;
	},

	/**
	 * @param {HTMLElement}	form
	 * @param {HTMLElement}	step
	 */
	async show(form, step, animated = true) {
		if (this.changing)
			return;

		this.changing = true;
		if (this.activeStep)
			this.activeStep.classList.remove("active");

		step.classList.add("active");
		this.activeStep = step;
		this.main.content.forms.appendChild(form);

		if (this.activeForm)
			this.activeForm.classList.add("hide");

		if (!animated) {
			form.classList.add("show");
			
			if (this.activeForm) {
				this.activeForm.classList.remove("show", "hide");
				this.main.content.forms.removeChild(this.activeForm);
			}

			this.activeForm = form;
			this.changing = false;
			return;
		}

		// Start animation
		await delayAsync(200);
		form.classList.add("show");

		await delayAsync(350);

		if (this.activeForm) {
			this.activeForm.classList.remove("show", "hide");
			this.main.content.forms.removeChild(this.activeForm);
		}

		this.activeForm = form;
		this.changing = false;
	},

	/**
	 * Handle File Drop
	 * @param	{DragEvent|Event}	event
	 */
	handleDrop(event) {
		event.stopPropagation();
		event.preventDefault();

		/** @type {File} */
		let video;

		if (event instanceof DragEvent) {
			this.uploadForm.classList.remove("drag");
			video = event.dataTransfer.files[0];
		} else {
			video = event.target.files[0];
		}

		if (!video || !video.type.startsWith("video")) {
			this.uploadForm.notice.style.display = "block";
			return;
		}

		this.uploadForm.notice.style.display = null;
		this.video = video;
		this.onUpload();
	},

	/**
	 * VideoData object
	 * @typedef		VideoData
	 * @type		{Object}
	 * @property	{Number}		duration
	 * @property	{Blob}			thumbnail
	 */

	/**
	 * Get duration of video file
	 * @param	{File}		file
	 * @returns {Promise<VideoData>}
	 */
	async parseVideo(file) {
		return new Promise((resolve, reject) => {
			let data = {}
			let video = document.createElement("video");
			let canvas = document.createElement("canvas");

			video.onloadedmetadata = () => {
				data.duration = video.duration;
				video.muted = true;
				video.playsInline = true;
				video.play();
			}

			video.ontimeupdate = () => {
				canvas.width = 720;
				canvas.height = 404;
				canvas.getContext("2d").drawImage(video, 0, 0, 720, 404);
				canvas.toBlob((blob) => {
					URL.revokeObjectURL(video.src);
					data.thumbnail = blob;
					video.ontimeupdate = null;
					video.pause();
					video.removeAttribute("src");
					resolve(data);
				});
			}

			video.onerror = () => reject("Video Load Errored!");
			video.preload = "metadata";
			video.src = URL.createObjectURL(file);
		});
	},

	/**
	 * Handle Upload Video
	 * @return {Promise}
	 */
	async onUpload() {
		if (!this.video)
			return;

		this.uploadForm.choose.loading(true);
		this.uploadForm.choose.dataset.triColor = "blue";
		let meta = await this.parseVideo(this.video);
		this.log("INFO", "Creating new video record...");

		try {
			let response = await myajax({
				url: "/api/video/create",
				method: "POST",
				json: {
					filename: this.video.name,
					length: Math.round(meta.duration)
				}
			});

			this.record = Video.processResponse(response.data);
		} catch(e) {
			this.log("ERRR", e);
			this.uploadForm.choose.dataset.triColor = "red";
			this.uploadForm.choose.loading(false);
			return;
		}

		this.log("OKAY", "Created new video with hash", this.record.hash);
		this.uploadForm.choose.loading(false);
		this.updateForm.right.thumbnail.image.src = URL.createObjectURL(meta.thumbnail);
		this.updateForm.left.titleInput.input.value = this.video.name;
		this.updateForm.right.link.value.innerText = this.record.getURL();
		this.updateForm.right.link.value.href = this.record.getURL();
		this.updateForm.right.filename.value.innerText = this.video.name;
		this.updateForm.right.size.value.innerText = convertSize(this.video.size);

		// Begin Upload
		this.show(this.updateForm, this.main.content.headers.update);
		this.showProgress();

		this.setProgress(0, "-- phút", "Đang Chuẩn Bị Tải Lên");

		// Upload thumbnail first
		try {
			await this.record.updateThumb(meta.thumbnail);
			this.updateForm.right.thumbnail.src = this.record.getThumbURL();
		} catch(e) {
			this.setProgress(-1, "-- phút", "Khởi Tạo Thất Bại!");
			return;
		}

		let tick = time();
		let loaded = 0;

		try {
			await myajax({
				url: `/api/video/upload/${this.record.hash}`,
				method: "POST",
				form: {
					video: this.video
				},

				/**
				 * Update Upload Progress
				 * @param {ProgressEvent<XMLHttpRequestEventTarget>} event 
				 */
				onUpload: (event) => {
					let progress = (event.loaded / event.total) * 100;
					let delta = (event.total - event.loaded);
					let rate = (event.loaded - loaded) / (time() - tick);
					let timeleft = delta / rate;
					let size = `${convertSize(event.loaded)}/${convertSize(event.total)}`;

					let left = formatTime(timeleft, {
						now: "Đang Hoàn Thành",
						prefix: "Còn"
					}) + ` (${convertSize(rate)}/s)`;

					this.setProgress(progress, left, size);

					loaded = event.loaded;
					tick = time();
				}
			});

			this.setProgress(100, "Tải Lên Hoàn Thành!");
			this.uploaded = true;

			this.completed();
		} catch(e) {
			this.setProgress(-1);
			this.log("ERRR", e);
			return;
		}
	},

	async onUpdate() {
		this.updateForm.left.buttons.submit.loading(true);
		this.updateForm.left.buttons.submit.dataset.triColor = "blue";
		
		this.record.name = this.updateForm.left.titleInput.input.value;
		this.record.description = this.updateForm.left.description.input.value;

		try {
			await this.record.save();
		} catch(e) {
			this.updateForm.left.buttons.submit.dataset.triColor = "red";
			this.updateForm.left.buttons.submit.loading(false);
			return;
		}
		
		if (this.updateForm.right.thumbnail.input.files[0]) {
			this.log("INFO", "New thumbnail detected! Uploading it now...");
			await this.record.updateThumb(this.updateForm.right.thumbnail.input.files[0]);
		}

		this.updateForm.left.buttons.submit.loading(false);
		this.updated = true;

		this.completed();
	},

	completed() {
		if (!this.updated)
			return;

		if (this.uploaded) {
			this.finishForm.appendChild(this.record.render());
			this.show(this.finishForm, this.main.content.headers.complete);
		} else
			this.show(this.completeForm, this.main.content.headers.complete);
	}
}

window.addEventListener("load", () => initGroup({ upload }, "modules"));