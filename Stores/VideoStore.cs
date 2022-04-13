﻿using System;
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
			using (Stream stream = File.Open(FILE_PATH, FileMode.Create)) {
				var bFormatter = new System.Runtime.Serialization.Formatters.Binary.BinaryFormatter();
				bFormatter.Serialize(stream, List);
			}
		}

		public static void Load() {
			using (Stream stream = File.Open(FILE_PATH, FileMode.Open)) {
				var bFormatter = new System.Runtime.Serialization.Formatters.Binary.BinaryFormatter();
				List = (List<Video>) bFormatter.Deserialize(stream);
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
	}
}