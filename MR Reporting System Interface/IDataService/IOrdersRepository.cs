using System.Collections.Generic;
using MR_Reporting_System_Data_Context.Context;
using MR_Reporting_System_Model.DataTransferObjectModel;
using System.Linq;

namespace MR_Reporting_System_Interface.IDataService
{
    public interface IOrdersRepository : IGenericRepository<Order>
    {
        List<DtoOrders> selectAll(string lang);
        List<DtoOrders> getOrdersByClient(int clientId, string lang);
        List<DtoOrders> getOrdersByAgentId(int agentId, string lang);
        List<DtoSummaryWords> AlertsByOrders();
        List<DtoSummaryWords> AlertsApproved();
        List<DtoSummaryWords> AlertsOrdersandApprvoved();
        DtoOrders selectById(int id, string lang); 
    }
}

