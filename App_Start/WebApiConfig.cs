﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Routing;

namespace Vi2B {
    public static class WebApiConfig {
        public static void Register(HttpConfiguration config) {
            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();

			RouteTable.Routes.MapPageRoute("Trang Chủ", "", "~/Pages/index.aspx");
			RouteTable.Routes.MapPageRoute("Tải Lên", "upload", "~/Pages/upload.aspx");
			RouteTable.Routes.MapPageRoute("Xem Video", "watch", "~/Pages/watch.aspx");
        }
    }
}
