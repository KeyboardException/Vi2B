using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Routing;
using System.Web.SessionState;
using Vi2B.Stores;

namespace Vi2B {
    public class WebApiApplication : System.Web.HttpApplication {
        protected void Application_Start() {
			Config.Load();
			UserStore.Init();
			VideoStore.Init();

            GlobalConfiguration.Configure(WebApiConfig.Register);
        }

		protected void Application_BeginRequest(object sender, EventArgs e) {
			Console.WriteLine("Reloading Data");
			UserStore.Load();
			VideoStore.Load();
		}

		protected void Application_PostAuthorizeRequest() {
			if (IsWebApiRequest()) {
				HttpContext.Current.SetSessionStateBehavior(SessionStateBehavior.Required);
			}
		}

		private bool IsWebApiRequest() {
			return HttpContext.Current.Request.AppRelativeCurrentExecutionFilePath.StartsWith(WebApiConfig.UrlPrefixRelative);
		}
	}
}
