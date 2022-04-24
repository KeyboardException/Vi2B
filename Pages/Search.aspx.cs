using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Vi2B.Stores;

namespace Vi2B.Pages {
	public partial class Search1 : System.Web.UI.Page {
		protected void Page_Load(object sender, EventArgs e) {
			var query = Request.Params.Get("query");
			if (query == null || query == "")
				Response.Redirect("/");

			var tokens = query.ToLower().Split(' ');
			var html = "";
			var videos = VideoStore.GetAll();

			foreach (var video in videos) {
				bool match = true;
				foreach (var token in tokens) {
					if (!video.name.ToLower().Contains(token)) {
						match = false;
						break;
					}
				}
				if (match)
					html += video.RenderCard();
			}

			VideoCards.InnerHtml = html;
		}
	}
}