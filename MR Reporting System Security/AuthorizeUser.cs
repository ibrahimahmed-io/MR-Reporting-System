using System;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;

namespace MR_Reporting_System_Security
{
    public class AuthorizeUser : AuthorizeAttribute
    {
        public string AuthorizationToken { get; set; }

        protected override bool IsAuthorized(HttpActionContext actionContext)
        {
            var secret = TokenManager.Base64Encode(SecurityConstants.KeyForHmacSha256);

            var currentTime = (long)(DateTime.Now - new DateTime(1970, 1, 1, 0, 0, 0, 0).ToLocalTime()).TotalSeconds;

            if (!HttpContext.Current.Request.Headers.AllKeys.Contains("Authorization")) return false;

            var token = HttpContext.Current.Request.Headers.GetValues("Authorization");

            if (token == null) return false;

            AuthorizationToken = token[0];

            bool validated;

            var decodedPayload = TokenManager.DecodeToken(AuthorizationToken, secret, out validated);

            if (!validated) return false;

            var expired = currentTime >= decodedPayload.exp;

            return !expired;
        }
    }
}
