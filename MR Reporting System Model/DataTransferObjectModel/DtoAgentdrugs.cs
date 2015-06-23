namespace MR_Reporting_System_Model.DataTransferObjectModel
{

    public class DtoAgentDrugs
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

        public int? DrugsId
        {
            get;
            set;
        }

        public string DrugsName
        {
            get;
            set;
        }
    }

}

