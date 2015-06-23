namespace MR_Reporting_System_Model.DataTransferObjectModel
{

    public class DtoAgentHospital
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

        public int? HospitalId
        {
            get;
            set;
        }

        public string HospitalName
        {
            get;
            set;
        }
    }

}

