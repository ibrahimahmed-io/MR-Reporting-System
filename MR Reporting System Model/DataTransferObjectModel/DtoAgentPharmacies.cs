namespace MR_Reporting_System_Model.DataTransferObjectModel
{

    public class DtoAgentPharmacies
    {
        public int Id
        {
            get;
            set;
        }

        public int? AgentId
        {
            get;
            set;
        }

        public string AgentName
        {
            get;
            set;
        }

        public int? PharmacyId
        {
            get;
            set;
        }

        public string PharmacyName
        {
            get;
            set;
        }
    }

}

