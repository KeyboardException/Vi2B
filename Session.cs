using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using Vi2B.Objects;
using static Vi2B.Utils;

namespace Vi2B {
	public class Session {
		public static int LIFE_TIME = 3200;
		public static Dictionary<string, Session> SessionList = new Dictionary<string, Session>();

		public User user;
		public string token;
		public int created;
		public int expire;

		public bool Valid() {
			return (expire >= TimeStamp());
		}

		public static Session Create(User user) {
			Session session = new Session();
			session.user = user;
			session.token = RandomString(32);
			session.created = TimeStamp();
			session.expire = session.created + LIFE_TIME;

			SessionList.Add(session.token, session);
			return session;
		}

		public static Session Get(HttpRequestMessage request) {
			var headerCookies = request.Headers.GetCookies();
			string token = null;

			foreach (var h in headerCookies) {
				var cookies = h.Cookies;

				foreach (var cookie in cookies) {
					if (cookie.Name == "Session") {
						token = cookie.Value;
						break;
					}
				}

				if (token != null)
					break;
			}

			if (token == null || !SessionList.ContainsKey(token))
				return null;

			return SessionList[token];
		}

		public static Session Get(string token) {
			var session = SessionList[token];

			if (session == null)
				return null;

			if (!session.Valid()) {
				SessionList.Remove(token);
				return null;
			}

			return session;
		}
	}
}