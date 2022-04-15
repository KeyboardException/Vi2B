using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Web;

namespace Vi2B.Objects {
	[Serializable()]
	public class User {
		public string username;
		public string name;
		public string password;

		public static User Create(string username, string name, string password) {
			User user = new User();
			user.username = username;
			user.name = name;
			user.password = HashPassword(password);

			return user;
		}

		public string GetAvatar() {
			return "/api/avatar/" + username;
		}

		protected static string HashPassword(string password) {
			// Create salt
			byte[] salt;
			new RNGCryptoServiceProvider().GetBytes(salt = new byte[16]);

			// hash password with created salt
			var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 100000);
			byte[] hash = pbkdf2.GetBytes(20);

			// Combine salt with hash
			byte[] hashBytes = new byte[36];
			Array.Copy(salt, 0, hashBytes, 0, 16);
			Array.Copy(hash, 0, hashBytes, 16, 20);

			return Convert.ToBase64String(hashBytes);
		}

		public bool VerifyPassword(string password) {
			byte[] hashBytes = Convert.FromBase64String(this.password);

			// Get the salt
			byte[] salt = new byte[16];
			Array.Copy(hashBytes, 0, salt, 0, 16);

			// Compute the hash on the password the user entered
			var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 100000);
			byte[] hash = pbkdf2.GetBytes(20);

			// Compare the results
			for (int i = 0; i < 20; i++)
				if (hashBytes[i + 16] != hash[i])
					return false;

			return true;
		}
	}
}