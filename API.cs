using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;

namespace Vi2B {
	public class API {
		public string description { get; set; }
		public HttpStatusCode status { get; set; } = HttpStatusCode.OK;
		public object data { get; set; }

		public API(
			string description,
			HttpStatusCode status = HttpStatusCode.OK,
			object data = null
		) {
			this.description = description;
			this.status = status;
			this.data = data;
		}

		public static HttpResponseMessage Response(
			HttpRequestMessage Request,
			string description,
			HttpStatusCode status = HttpStatusCode.OK,
			object data = null,
			Session session = null
		) {
			var response = Request.CreateResponse(status, new API(description, status, data));

			if (session != null) {
				var cookie = new CookieHeaderValue("Session", session.token);
				cookie.Expires = DateTimeOffset.Now.AddDays(2);
				cookie.Domain = Request.RequestUri.Host;
				cookie.Path = "/";

				response.Headers.AddCookies(new CookieHeaderValue[] { cookie });
			}

			return response;
		}
	}
}