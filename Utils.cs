﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace Vi2B {
	public class Utils {
		private static readonly Random Random = new Random();

		private static readonly List<KeyValuePair<string, int>> TimeMap
			= new List<KeyValuePair<string, int>>() {
				new KeyValuePair<string, int>("năm", 31536000),
				new KeyValuePair<string, int>("ngày", 86400),
				new KeyValuePair<string, int>("giờ", 3600),
				new KeyValuePair<string, int>("phút", 60),
				new KeyValuePair<string, int>("giây", 1)
			};

		public static DateTime UnixToDateTime(int time) {
            // Unix timestamp is seconds past epoch
            DateTime dateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
            dateTime = dateTime.AddSeconds(time).ToLocalTime();
            return dateTime;
        }

        public static int DateTimeToUnix(DateTime date) {
            return (int) (TimeZoneInfo.ConvertTimeToUtc(date) -
                new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc)).TotalSeconds;
        }

		public static int TimeStamp() {
			return DateTimeToUnix(DateTime.Now);
		}

		public static string MD5(string input) {
			// Use input string to calculate MD5 hash
			using (System.Security.Cryptography.MD5 md5 = System.Security.Cryptography.MD5.Create()) {
				byte[] inputBytes = Encoding.ASCII.GetBytes(input);
				byte[] hashBytes = md5.ComputeHash(inputBytes);

				// Convert the byte array to hexadecimal string
				StringBuilder sb = new StringBuilder();
				for (int i = 0; i < hashBytes.Length; i++)
					sb.Append(hashBytes[i].ToString("X2"));
				
				return sb.ToString().ToLower();
			}
		}

		public static string RandomString(int length) {
			const string chars = "abcdefghijklmnopqrstuvwxyz0123456789";
			return new string(Enumerable.Repeat(chars, length)
				.Select(s => s[Random.Next(s.Length)]).ToArray());
		}

		public static String ParseTime(int t = 0) {
			var h = Math.Floor(t / 3600d);
			var m = Math.Floor(t % 3600d / 60d);
			var s = Math.Floor(t % 3600d % 60d);

			return (h > 0)
				? String.Format("{0:00}:{1:00}:{2:00}", h, m, s)
				: String.Format("{0:00}:{1:00}", m, s);
		}

		public static String ReadableTime(int t = 0) {
			if (t == 0)
				return "bây giờ";

			foreach (var map in TimeMap) {
				if (t > map.Value)
					return Math.Floor((double) t / (double) map.Value) + " " + map.Key;
			}

			return t + "giây trước";
		}

		public class LazyLoadOptions {
			public string url;
			public string[] classes;
			public object attributes;
			public string tag = "div";
			public string spinner = "simpleSpinner";
		}

		public static string LazyLoad(LazyLoadOptions options) {
			var id = "lazyload_" + RandomString(6);
			var attributes = (options.attributes != null)
				? Newtonsoft.Json.JsonConvert.SerializeObject(options.attributes)
				: "{}";

			var classes = (options.classes != null)
				? Newtonsoft.Json.JsonConvert.SerializeObject(options.classes)
				: "[]";

			HtmlTemplate template = new HtmlTemplate("LazyLoad");
			return template.Render(new {
				id = id,
				attributes = attributes,
				classes = classes,
				url = options.url,
				spinner = options.spinner
			});
		}
	}
}