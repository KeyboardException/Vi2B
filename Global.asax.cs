using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Routing;
using Vi2B.Stores;

namespace Vi2B {
    public class WebApiApplication : System.Web.HttpApplication {
        protected void Application_Start() {
			Config.Load();
			VideoStore.Init();

            GlobalConfiguration.Configure(WebApiConfig.Register);
        }
    }
}
