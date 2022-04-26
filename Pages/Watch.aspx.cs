using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Vi2B.Stores;

namespace Vi2B.Pages {
	public partial class Watch : System.Web.UI.Page {
		protected void Page_Load(object sender, EventArgs e) {
			var hash = Request.QueryString.Get("v");

			if (hash == null)
				Response.Redirect("/");

			var video = VideoStore.Get(hash);
			if (video == null)
				Response.Redirect("/");

			video.views += 1;
			VideoStore.Save();

			var author = video.GetUser();
			VideoName.InnerText = video.name;

			HtmlTemplate infoTemplate = new HtmlTemplate("VideoInfo");
			VideoInfo.InnerHtml = infoTemplate.Render(new {
				views = video.views.ToString(),
				uploaded = video.GetCreated().ToString("d")
			});

			HtmlTemplate authorTemplate = new HtmlTemplate("VideoAuthor");
			VideoAuthor.InnerHtml = authorTemplate.Render(new {
				avatar = Utils.LazyLoad(new Utils.LazyLoadOptions() {
					url = author.GetAvatar(),
					classes = new string[] { "avatar" }
				}),

				name = author.name,
				username = author.username,
				subs = "0",
				description = video.description
			});

			var nextVideosHtml = "";
			var nextVideos = VideoStore.GetNextVideos(video, 20);

			foreach (var v in nextVideos)
				nextVideosHtml += v.RenderList();

			NextVideos.InnerHtml = nextVideosHtml;
		}
	}
}