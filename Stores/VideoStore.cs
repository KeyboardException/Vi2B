using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using Vi2B.Objects;

namespace Vi2B.Stores {
	public class VideoStore {
		public static string FILE_PATH;
		public static List<Video> List;

		public static void Init() {
			FILE_PATH = Path.Combine(Config.DataRoot, "video.bin");

			if (File.Exists(FILE_PATH)) {
				Load();
			} else {
				List = new List<Video>();
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
			try {
				using (FileStream stream = new FileStream(FILE_PATH, FileMode.Open, FileAccess.Read, FileShare.ReadWrite)) {
					var bFormatter = new System.Runtime.Serialization.Formatters.Binary.BinaryFormatter();
					List = (List<Video>) bFormatter.Deserialize(stream);
				}
			} catch(Exception e) {
				Console.WriteLine("Cannot Load Video Store! " + e.Message);
				List = new List<Video>();
			}
		}

		public static List<Video> GetAll() {
			return List;
		}

		public static void Add(Video video) {
			List.Add(video);
			Save();
		}

		public static Video Get(String hash) {
			foreach (var video in List) {
				if (video.hash == hash)
					return video;
			}

			return null;
		}

		public static bool Delete(Video video) {
			if (!List.Contains(video))
				return false;

			List.Remove(video);
			Save();
			return true;
		}

		public static List<Video> GetNextVideos(Video current, int limit = 20) {
			List<Video> list = new List<Video>();
			Dictionary<int, int> randoms = new Dictionary<int, int>();

			limit = Math.Min(limit, List.Count - 1);

			while (randoms.Count < limit) {
				int randomInt = new Random().Next(limit);

				try {
					randoms.Add(randomInt, randomInt);
				} catch (ArgumentException aex) {
					// We can assume this element exists in the dictonary already.
				}
			}

			foreach (int key in randoms.Keys)
				list.Add(List[randoms[key]]);

			return list;
		}
	}
}