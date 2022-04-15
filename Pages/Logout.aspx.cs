using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Vi2B.Pages {
	public partial class Logout : System.Web.UI.Page {
		protected void Page_Load(object sender, EventArgs e) {
			Session session = Vi2B.Session.Get(Request);
			if (session == null)
				Response.Redirect("/");

			session.Destroy();
			if (Request.Cookies["Session"] != null) {
				HttpCookie cookie = new HttpCookie("Session");
				cookie.Expires = DateTime.Now.AddDays(-1d);
				Response.Cookies.Add(cookie);
			}

			Response.Redirect("/");
		}
	}
}