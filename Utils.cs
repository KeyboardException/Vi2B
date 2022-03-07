using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace Vi2B {
	public class Utils {
		private static Random random = new Random();

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
				.Select(s => s[random.Next(s.Length)]).ToArray());
		}
	}
}