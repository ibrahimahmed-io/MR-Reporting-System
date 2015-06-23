using System;

namespace MR_Reporting_System_Security
{
    public class SecurityConstants
    {
        public static readonly string Base64Hmac =
            "rQGbwmRDfUxn0BTHhacBnWcf6oJzWYdt9Blo6face0DzjGNau02UHxMfSj8lwhypobp+x3YfytMImQRh3KYoyw==";

        public static readonly byte[] KeyForHmacSha256;

        public static readonly string TokenIssuer;

        public static readonly int TokenLifetimeMinutes = 30;

        static SecurityConstants()
        {
            KeyForHmacSha256 = Convert.FromBase64String(Base64Hmac);

            TokenIssuer = "api/Procoor";
        }
    }
}
