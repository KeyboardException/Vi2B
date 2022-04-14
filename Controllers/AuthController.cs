using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Vi2B.Objects;
using Vi2B.Stores;

namespace Vi2B {
	public class AuthController : ApiController {
		public class AuthLoginModel {
			public string username;
			public string password;
		}

		public class AuthRegisterModel {
			public string username;
			public string password;
			public string name;
		}

		[HttpPost]
		[Route("api/login")]
		public HttpResponseMessage Login([FromBody] AuthLoginModel data) {
			if (data == null || data.username == null)
				return API.Response(Request, "Không thấy username!", HttpStatusCode.BadRequest);

			User user = UserStore.Get(data.username);

			if (user == null)
				return API.Response(Request, "User không tồn tại!", HttpStatusCode.NotFound);

			if (data.password == null || !user.VerifyPassword(data.password))
				return API.Response(Request, "Sai mật khẩu!", HttpStatusCode.Forbidden);

			Session session = Session.Create(user);
			return API.Response(Request, "Đăng nhập thành công!", session: session);
		}

		[HttpGet]
		[Route("api/validate/{username}")]
		public HttpResponseMessage Validate(string username) {
			if (UserStore.Get(username) != null)
				return API.Response(Request, "Tên đăng nhập đã được sử dụng!", HttpStatusCode.Forbidden);

			return API.Response(Request, "Tên đăng nhập có thể sử dụng!");
		}

		[HttpPost]
		[Route("api/register")]
		public HttpResponseMessage Register([FromBody] AuthRegisterModel data) {
			if (data == null)
				return API.Response(Request, "Nội dung yêu cầu trống!", HttpStatusCode.BadRequest);

			if (data.username == null || data.password == null || data.name == null)
				return API.Response(Request, "Một số trường cần thiết bị bỏ trống!", HttpStatusCode.BadRequest);

			if (UserStore.Get(data.username) != null)
				return API.Response(Request, "Tên đăng nhập đã được sử dụng!", HttpStatusCode.Forbidden);

			//if (data.password.Length < 8)
			//	return API.Response(Request, "Mật khẩu quá ngắn!", HttpStatusCode.BadRequest);

			User user = Objects.User.Create(data.username, data.name, data.password);
			UserStore.Add(user);
			Session session = Session.Create(user);
			return API.Response(Request, "Đăng kí thành công!", session: session);
		}

		[HttpGet]
		[Route("api/session")]
		public HttpResponseMessage GetSession() {
			Session session = Session.Get(Request);
			
			if (session == null)
				return API.Response(Request, "Not Authorized", HttpStatusCode.Forbidden);

			return API.Response(Request, "Authorized", data: session);
		}
	}
}