using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Vi2B.Stores;

namespace Vi2B.Pages {
	public partial class Personal : System.Web.UI.Page {
		protected void Page_Load(object sender, EventArgs e) {
			var html = "";
			var videos = VideoStore.GetAll();
			var session = Vi2B.Session.Get(Request);
			
			if (session == null || !session.Valid()) {
				Response.Redirect("/");
			}

			foreach (var video in videos) {
				if (video.username == session.user.username)
					html += video.RenderCard();
			}

			VideoCards.InnerHtml = html;
		}
	}
}