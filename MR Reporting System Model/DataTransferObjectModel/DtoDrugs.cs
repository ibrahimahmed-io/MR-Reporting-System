namespace MR_Reporting_System_Model.DataTransferObjectModel
{

    public class DtoDrugs
    {
        public int Id
        {
            get;
            set;
        }

        public string Name
        {
            get;
            set;
        }

        public string Description
        {
            get;
            set;
        }

        public string Code
        {
            get;
            set;
        }

        public double? Price
        {
            get;
            set;
        }

        public int? SectionId
        {
            get;
            set;
        }

        public string SectionName
        {
            get;
            set;
        }

        public string Notes
        {
            get;
            set;
        }

        public int? CompanyId
        {
            get;
            set;
        }

        public string CompanyName
        {
            get;
            set;
        }

        public int? DeletedBy
        {
            get;
            set;
        }

        public string DeletedByUserName
        {
            get;
            set;
        }
    }

}

