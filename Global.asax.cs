using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Routing;

namespace Vi2B {
    public class WebApiApplication : System.Web.HttpApplication {
        protected void Application_Start() {
            DB.Connect();
            GlobalConfiguration.Configure(WebApiConfig.Register);
        }
    }
}
