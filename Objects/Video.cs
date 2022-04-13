using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace Vi2B.Objects {
	[Serializable()]
	public class Video {
		public string name;
		public string hash;
		public int length;
		public int created;
		public int views = 0;
		public string description = "";
		public string videoType = null;
		public string thumbnailType = null;
		public bool uploaded = false;

		public String Render() {
			return "";
		}
	}
}