using System.Collections.Generic;
using MR_Reporting_System_Data_Context.Context;
using MR_Reporting_System_Model.DataTransferObjectModel;

namespace MR_Reporting_System_Interface.IDataService
{
    public interface IAgentAreaRepository : IGenericRepository<AgentArea>
    {
        List<DtoAgentArea> SelectAll(string lang, int agentId);
        DtoAgentArea SelectById(int id, string lang);
    }
}

