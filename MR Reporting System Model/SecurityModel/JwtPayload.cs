namespace MR_Reporting_System_Model.SecurityModel
{
    public class JwtPayload
    {
        // ReSharper disable once InconsistentNaming
        public string iss { get; set; }
        // ReSharper disable once InconsistentNaming
        public string sub { get; set; }
        // ReSharper disable once InconsistentNaming
        public long iat { get; set; }
        // ReSharper disable once InconsistentNaming
        public long exp { get; set; }
        // ReSharper disable once InconsistentNaming
        public string aoi { get; set; }

        public string uty { get; set; }
        public string gri { get; set; }

        //contact id for logged user
        public string cni { get; set; }

        //company Id for logged user
        public string cmi { get; set; }

        //current Page for logged user
        public string cup { get; set; }
        //ihr for logged user
        public string ihr { get; set; }

        public string acn { get; set; }

        public string pwe { get; set; }
        public string spi { get; set; }
        public string emp { get; set; }
    }
}
