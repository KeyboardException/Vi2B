using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace Vi2B {
    public static class WebApiConfig {
        public static void Register(HttpConfiguration config) {
            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();

			config.Routes.MapHttpRoute(
				name: "GetVideoAPI",
				routeTemplate: "api/{controller}/{id}",
				defaults: new { }
			);

			config.Routes.MapHttpRoute(
                name: "VideoAPI",
                routeTemplate: "api/{controller}/{action}",
                defaults: new { }
            );

			config.Routes.MapHttpRoute(
				name: "UploadVideoAPI",
				routeTemplate: "api/{controller}/{action}/{hash}",
				defaults: new { }
			);
        }
    }
}
