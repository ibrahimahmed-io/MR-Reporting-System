namespace MR_Reporting_System_Model.DataTransferObjectModel
{

    public class DtoDistributers
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

        public int? AreaId
        {
            get;
            set;
        }

        public string AreaName
        {
            get;
            set;
        }

        public string Address
        {
            get;
            set;
        }

        public string Phone
        {
            get;
            set;
        }

        public string Code
        {
            get;
            set;
        }

        public int? NoOfVisits
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

