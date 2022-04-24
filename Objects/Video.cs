using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using Vi2B.Stores;
using static Vi2B.Utils;

namespace Vi2B.Objects {
	[Serializable()]
	public class Video {
		public string name;
		public string hash;
		public int length;
		public int created;
		public string username;
		public int views = 0;
		public string description = "";
		public string videoType = null;
		public string thumbnailType = null;
		public bool uploaded = false;

		[NonSerialized]
		protected User user;

		public User GetUser() {
			if (user == null)
				user = UserStore.Get(username);

			// Người dùng cho video này không tồn tại, tạo tài khoản
			// giả fallback cho tài khoản.
			if (user == null) {
				user = new User();
				user.username = username;
				user.name = "Người Dùng Không Tồn Tại (" + username + ")";
			}

			return user;
		}

		public string GetThumbURL() {
			return "/api/video/thumbnail/" + hash;
		}

		public string GetVideoURL() {
			return "/watch?v=" + hash;
		}

		public DateTime GetCreated() {
			return UnixToDateTime(created);
		}

		public String RenderCard() {
			HtmlTemplate template = new HtmlTemplate("VideoCard");
			User user = GetUser();

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
					url = user.GetAvatar(),
					classes = new string[] { "avatar" }
				}),

				length = ParseTime(length),
				url = GetVideoURL(),
				this.name,
				channel = user.name,
				views = views.ToString(),
				uploaded = ReadableTime(DateTimeToUnix(DateTime.Now) - created)
			});
		}

		public String RenderList() {
			HtmlTemplate template = new HtmlTemplate("VideoList");
			User user = GetUser();

			return template.Render(new {
				thumbnail = LazyLoad(new LazyLoadOptions() {
					url = GetThumbURL(),
					classes = new string[] { "thumbnail" },
					tag = "a",
					attributes = new {
						href = GetVideoURL()
					}
				}),

				length = ParseTime(length),
				url = GetVideoURL(),
				this.name,
				channel = user.name,
				views = views.ToString(),
				uploaded = ReadableTime(DateTimeToUnix(DateTime.Now) - created)
			});
		}
	}
}