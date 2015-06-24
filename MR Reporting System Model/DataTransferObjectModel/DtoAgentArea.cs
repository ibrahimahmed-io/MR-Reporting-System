using System.Collections.Generic;
namespace MR_Reporting_System_Model.DataTransferObjectModel
{

    public class DtoAgentArea
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
        public List<int> agentAreas { get; set; }
    }

}

