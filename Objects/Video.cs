using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using static Vi2B.Utils;

namespace Vi2B.Objects {
	[Serializable()]
	public class Video {
		public string name;
		public string hash;
		public int length;
		public int created;
		public int views = 0;
		public string description = "";
		public string videoType = null;
		public string thumbnailType = null;
		public bool uploaded = false;

		public string GetThumbURL() {
			return "/api/video/thumbnail/" + hash;
		}

		public string GetVideoURL() {
			return "/watch?v=" + hash;
		}

		public DateTime GetCreated() {
			return UnixToDateTime(created);
		}

		public String Render() {
			HtmlTemplate template = new HtmlTemplate("VideoCard");

			return template.Render(new {
				thumbnail = LazyLoad(new LazyLoadOptions() {
					url = GetThumbURL(),
					classes = new string[] { "thumbnail" },
					tag = "a",
					attributes = new {
						href = GetVideoURL()
					}
				}),

				avatar = LazyLoad(new LazyLoadOptions() {
					url = "/static/img/avatar.svg",
					classes = new string[] { "avatar" }
				}),

				length = ParseTime(length),
				url = GetVideoURL(),
				this.name,
				channel = "Admin",
				views = views.ToString(),
				uploaded = ReadableTime(DateTimeToUnix(DateTime.Now) - created)
			});
		}
	}
}