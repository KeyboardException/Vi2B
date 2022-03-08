using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;
using Vi2B.Objects;

namespace Vi2B.Controllers {
	public class VideoController : ApiController {

		public const int ReadStreamBufferSize = 1024 * 1024;

		public class CreateVideoModel {
			public string filename { get; set; }
			public int length { get; set; }
		}

		public class UpdateVideoModel {
			public int? id { get; set; } = null;
			public string hash { get; set; } = null;
			public string name { get; set; }
			public string description { get; set; }
		}

		private static bool TryReadRangeItem(
			RangeItemHeaderValue range,
			long contentLength,
			out long start,
			out long end
		) {
			if (range.From != null) {
				start = range.From.Value;

				if (range.To != null)
					end = range.To.Value;
				else
					end = contentLength - 1;
			} else {
				end = contentLength - 1;

				if (range.To != null)
					start = contentLength - range.To.Value;
				else
					start = 0;
			}

			return (start < contentLength && end < contentLength);
		}

		private static void CreatePartialContent(
			Stream inputStream,
			Stream outputStream,
			long start,
			long end
		) {
			int count = 0;
			long remainingBytes = end - start + 1;
			long position = start;
			byte[] buffer = new byte[ReadStreamBufferSize];

			inputStream.Position = start;

			do {
				try {
					if (remainingBytes > ReadStreamBufferSize)
						count = inputStream.Read(buffer, 0, ReadStreamBufferSize);
					else
						count = inputStream.Read(buffer, 0, (int) remainingBytes);
					outputStream.Write(buffer, 0, count);
				} catch (Exception error) {
					Console.WriteLine(error);
					break;
				}

				position = inputStream.Position;
				remainingBytes = end - position + 1;
			} while (position <= end);
		}

		[HttpPost]
		[Route("api/video/create")]
		public Video CreateVideo([FromBody] CreateVideoModel model) {
			if (model == null || model.filename == null)
				throw new ArgumentException("Unspecified filename and length!");

			Video video = new Video();
			video.name = model.filename;
			video.hash = Utils.MD5(model.filename + Utils.RandomString(3));
			video.length = model.length;
			video.created = Utils.TimeStamp();
			video.Save();

			return video;
		}

		[HttpPost]
		[Route("api/video/upload/{hash}")]
		public HttpResponseMessage UploadVideo(string hash) {
			HttpResponseMessage result;
			var request = HttpContext.Current.Request;

			if (request.Files["video"] != null) {
				var file = request.Files["video"];

				if (!file.ContentType.StartsWith("video"))
					return API.Response(Request, "Invalid Video File!", HttpStatusCode.BadRequest);

				Video video = Video.Get(hash);
				var path = HttpContext.Current.Server.MapPath("~/data/videos/" + video.hash);
				file.SaveAs(path);

				video.videoType = file.ContentType;
				video.uploaded = true;
				video.Save();

				result = API.Response(Request, "Video Uploaded Successfully!");
			} else {
				result = API.Response(Request, "No Video Found In This Request!", HttpStatusCode.BadRequest);
			}

			return result;
		}

		[HttpGet]
		[Route("api/video/fetch/{hash}")]
		public HttpResponseMessage GetVideo(string hash) {
			Video video = Video.Get(hash);

			var path = HttpContext.Current.Server.MapPath("~/data/videos/" + video.hash);
			FileInfo fileInfo = new FileInfo(path);

			if (!fileInfo.Exists)
				return API.Response(Request, "Missing video file!", HttpStatusCode.NotFound);

			long totalLength = fileInfo.Length;

			MediaTypeHeaderValue mime = new MediaTypeHeaderValue(video.videoType);
			RangeHeaderValue rangeHeader = Request.Headers.Range;
			HttpResponseMessage response = new HttpResponseMessage();

			response.Headers.AcceptRanges.Add("bytes");

			// The request will be treated as normal request if there is no Range header.
			if (rangeHeader == null || !rangeHeader.Ranges.Any()) {
				response.StatusCode = HttpStatusCode.OK;
				response.Content = new PushStreamContent((outputStream, httpContent, transpContext)
				=> {
					using (outputStream) // Copy the file to output stream straightforward. 
					using (Stream inputStream = fileInfo.OpenRead()) {
						try {
							inputStream.CopyTo(outputStream, ReadStreamBufferSize);
						} catch (Exception error) {
							Console.WriteLine(error);
						}
					}
				}, mime);

				response.Content.Headers.ContentLength = totalLength;
				return response;
			}

			long start = 0, end = 0;

			// 1. If the unit is not 'bytes'.
			// 2. If there are multiple ranges in header value.
			// 3. If start or end position is greater than file length.
			if (rangeHeader.Unit != "bytes" || rangeHeader.Ranges.Count > 1 ||
				!TryReadRangeItem(rangeHeader.Ranges.First(), totalLength, out start, out end)) {
				response.StatusCode = HttpStatusCode.RequestedRangeNotSatisfiable;
				response.Content = new StreamContent(Stream.Null);  // No content for this status.
				response.Content.Headers.ContentRange = new ContentRangeHeaderValue(totalLength);
				response.Content.Headers.ContentType = mime;

				return response;
			}

			var contentRange = new ContentRangeHeaderValue(start, end, totalLength);

			// We are now ready to produce partial content.
			response.StatusCode = HttpStatusCode.PartialContent;
			response.Content = new PushStreamContent((outputStream, httpContent, transpContext)
			=> {
				using (outputStream) // Copy the file to output stream in indicated range.
				using (Stream inputStream = fileInfo.OpenRead())
					CreatePartialContent(inputStream, outputStream, start, end);

			}, mime);

			response.Content.Headers.ContentLength = end - start + 1;
			response.Content.Headers.ContentRange = contentRange;

			return response;
		}

		[HttpGet]
		[Route("api/video/thumbnail/{hash}")]
		public HttpResponseMessage GetThumbnail(string hash) {
			HttpResponseMessage result;

			Video video = Video.Get(hash);
			var path = HttpContext.Current.Server.MapPath("~/data/thumbnails/" + video.hash);
			FileStream stream = File.OpenRead(path);

			result = new HttpResponseMessage(HttpStatusCode.OK);
			result.Content = new StreamContent(stream);
			result.Content.Headers.ContentType = new MediaTypeHeaderValue(video.thumbnailType);

			return result;
		}

		[HttpPost]
		[Route("api/video/thumbnail/{hash}")]
		public HttpResponseMessage UpdateThumbnail(string hash) {
			HttpResponseMessage result;
			var request = HttpContext.Current.Request;

			if (request.Files["thumbnail"] != null) {
				var file = request.Files["thumbnail"];

				if (!file.ContentType.StartsWith("image"))
					return API.Response(Request, "Invalid Image File!", HttpStatusCode.BadRequest);

				Video video = Video.Get(hash);
				var path = HttpContext.Current.Server.MapPath("~/data/thumbnails/" + video.hash);
				file.SaveAs(path);

				video.thumbnailType = file.ContentType;
				video.uploaded = true;
				video.Save();

				result = API.Response(Request, "Thumbnail Updated Successfully!");
			} else {
				result = API.Response(Request, "No Thumbnail Found In This Request!", HttpStatusCode.BadRequest);
			}

			return result;
		}

		[HttpPost]
		[Route("api/video/update")]
		public HttpResponseMessage UpdateVideo([FromBody] UpdateVideoModel model) {
			Video video;

			if (model == null || (model.id == null && model.hash == null))
				throw new ArgumentException("Body Data Is Empty Or Invalid!");

			if (model.id != null)
				video = Video.Get((int) model.id);
			else
				video = Video.Get(model.hash);

			if (model.name != null)
				video.name = model.name;

			if (model.description != null)
				video.description = model.description;

			video.Save();
			return API.Response(Request, "Video Info Updated Successfully!");
		}

		[HttpGet]
		[Route("api/video/id/{id}")]
		public Video Get(int id) {
			return Video.Get(id);
		}

		[HttpGet]
		[Route("api/video/{hash}")]
		public Video Get(string hash) {
			return Video.Get(hash);
		}

		[HttpGet]
		[Route("api/videos")]
		public List<Video> GetAll() {
			return Video.GetAll();
		}
	}
}