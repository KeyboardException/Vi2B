using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;

namespace Vi2B {
	public class API {
		public string description { get; set; }
		public HttpStatusCode status { get; set; } = HttpStatusCode.OK;
		public Type data { get; set; }

		public API(
			string description,
			HttpStatusCode status = HttpStatusCode.OK,
			Type data = null
		) {
			this.description = description;
			this.status = status;
			this.data = data;
		}

		public static HttpResponseMessage Response(
			HttpRequestMessage Request,
			string description,
			HttpStatusCode status = HttpStatusCode.OK,
			Type data = null
		) {
			return Request.CreateResponse(status, new API(description, status, data));
		}
	}
}