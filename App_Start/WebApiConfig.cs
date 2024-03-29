﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Routing;

namespace Vi2B {
	public static class WebApiConfig {
		public static string UrlPrefix { get { return "api"; } }
		public static string UrlPrefixRelative { get { return "~/api"; } }

		public static void Register(HttpConfiguration config) {
            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();

			RouteTable.Routes.MapPageRoute("Trang Chủ", "", "~/Pages/Index.aspx");
			RouteTable.Routes.MapPageRoute("Tải Lên", "upload", "~/Pages/Upload.aspx");
			RouteTable.Routes.MapPageRoute("Xem Video", "watch", "~/Pages/Watch.aspx"); 
			RouteTable.Routes.MapPageRoute("Tìm Video", "search", "~/Pages/Search.aspx");
			RouteTable.Routes.MapPageRoute("Đăng Nhập", "login", "~/Pages/Login.aspx");
			RouteTable.Routes.MapPageRoute("Đăng Xuất", "logout", "~/Pages/Logout.aspx");
			RouteTable.Routes.MapPageRoute("Kênh Của Tôi", "personal", "~/Pages/Personal.aspx");
			RouteTable.Routes.MapPageRoute("Kênh", "channel", "~/Pages/Channel.aspx");

		}
	}
}
