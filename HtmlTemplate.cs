using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace Vi2B {
	public class HtmlTemplate {
		private string template;

		public HtmlTemplate(string name) {
			string path = HttpContext.Current.Server.MapPath("~/Templates/" + name + ".html");

			using (var reader = new StreamReader(path))
				template = reader.ReadToEnd();
		}

		public string Render(object values) {
			string output = template;
			foreach (var p in values.GetType().GetProperties())
				output = output.Replace("{{" + p.Name + "}}", (p.GetValue(values, null) as string) ?? string.Empty);

			return output;
		}
	}
}