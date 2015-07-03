using System.Collections.Generic;
using MR_Reporting_System_Data_Context.Context;
using MR_Reporting_System_Model.DataTransferObjectModel;
using System.Linq;

namespace MR_Reporting_System_Interface.IDataService
{
    public interface IOrdersRepository : IGenericRepository<Order>
    {
        IQueryable<DtoOrders> selectAll(int agentId, string lang);

        //WriteMethod2

        DtoOrders selectById(int id, string lang); 
    }
}

