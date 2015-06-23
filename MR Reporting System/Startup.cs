using System;
using System.Threading.Tasks;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(MR_Reporting_System.Startup))]

namespace MR_Reporting_System
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
        }
    }
}
