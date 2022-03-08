﻿using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace Vi2B {
	public class DB {
		public static string ConnectionString;
		public static SqlConnection Connection;

		public static void Connect() {
			ConnectionString = Config.ConnectionString;
			Connection = new SqlConnection(ConnectionString);
			Connection.Open();
		}

		public static void Disconnect() {
			Connection.Dispose();
		}
	}
}