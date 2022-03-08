using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace Vi2B {
	public class DB {
		public static string ConnectionString = "Server=LEGION\\SQLEXPRESS;Database=Vi2B;User Id=link;Password=123456; MultipleActiveResultSets=True";
		public static SqlConnection Connection;

		public static void Connect() {
			Connection = new SqlConnection(ConnectionString);
			Connection.Open();
		}

		public static void Disconnect() {
			Connection.Dispose();
		}
	}
}