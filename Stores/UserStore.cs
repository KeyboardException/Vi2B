using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using Vi2B.Objects;

namespace Vi2B.Stores {
	public class UserStore {
		public static string FILE_PATH;
		public static List<User> List;

		public static void Init() {
			FILE_PATH = Path.Combine(Config.DataRoot, "users.bin");

			if (File.Exists(FILE_PATH)) {
				Load();
			} else {
				List = new List<User>();
			}
		}

		public static void Save() {
			try {
				using (FileStream stream = new FileStream(FILE_PATH, FileMode.Create, FileAccess.Write)) {
					var bFormatter = new System.Runtime.Serialization.Formatters.Binary.BinaryFormatter();
					bFormatter.Serialize(stream, List);
				}
			} catch (Exception e) {
				Console.WriteLine("Cannot Save Video Store! " + e.Message);
			}
		}

		public static void Load() {
			using (FileStream stream = new FileStream(FILE_PATH, FileMode.Open, FileAccess.Read, FileShare.ReadWrite)) {
				var bFormatter = new System.Runtime.Serialization.Formatters.Binary.BinaryFormatter();
				List = (List<User>) bFormatter.Deserialize(stream);
			}
		}

		public static List<User> GetAll() {
			return List;
		}

		public static void Add(User user) {
			if (List.Contains(user))
				return;

			List.Add(user);
			Save();
		}

		public static User Get(String username) {
			foreach (var user in List) {
				if (user.username == username)
					return user;
			}

			return null;
		}

		public static bool Delete(User user) {
			if (!List.Contains(user))
				return false;

			List.Remove(user);
			Save();
			return true;
		}
	}
}