using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;

namespace Vi2B {
	public class UserController : ApiController {

		[HttpGet]
		[Route("api/avatar/{user}")]
		public HttpResponseMessage Avatar(string user) {
			var result = new HttpResponseMessage(HttpStatusCode.OK);
			var path = Config.DataRoot + "/avatars/" + user;

			if (File.Exists(path)) {
				FileStream stream = File.OpenRead(path);

				result.Content = new StreamContent(stream);
				result.Content.Headers.ContentType = new MediaTypeHeaderValue("image/png");
			} else {
				result.Content = new StringContent(Utils.SvgAvatar(user));
				result.Content.Headers.ContentType = new MediaTypeHeaderValue("image/svg+xml");
			}

			return result;
		}
	}
}