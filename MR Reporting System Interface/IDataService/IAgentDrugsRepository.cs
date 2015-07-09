using System.Collections.Generic;
using MR_Reporting_System_Data_Context.Context;
using MR_Reporting_System_Model.DataTransferObjectModel;

namespace MR_Reporting_System_Interface.IDataService
{
    public interface IAgentDrugsRepository : IGenericRepository<AgentDrugs>
    {
        List<DtoAgentDrugs> SelectAll(string lang, int agentId);
        DtoAgentDrugs SelectById(int id, string lang);
    }
}

