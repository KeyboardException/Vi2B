using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace Vi2B {
	public class Config {
		public static string ConnectionString;
		public static string DataRoot;

		public static void Load() {
			StreamReader reader = new StreamReader(HttpContext.Current.Server.MapPath("~/config.json"));
			dynamic config = JsonConvert.DeserializeObject(reader.ReadToEnd());

			ConnectionString = config.ConnectionString;
			DataRoot = config.DataRoot;

			if (DataRoot == "")
				DataRoot = HttpContext.Current.Server.MapPath("~/data");

			Console.WriteLine("DataRoot: " + DataRoot);
		}
	}
}