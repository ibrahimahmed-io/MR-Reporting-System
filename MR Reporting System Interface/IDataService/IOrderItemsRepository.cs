using System.Collections.Generic;
using MR_Reporting_System_Data_Context.Context;
using MR_Reporting_System_Model.DataTransferObjectModel;
using System.Linq;

namespace MR_Reporting_System_Interface.IDataService
{
    public interface IOrderItemsRepository : IGenericRepository<ordersItem>
    {
        IQueryable<DtoOrdersItems> selectAll(int orderId, string lang);

        //WriteMethod2

        DtoOrdersItems selectById(int id, string lang); 
    }
}

