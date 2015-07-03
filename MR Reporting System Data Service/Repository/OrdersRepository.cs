using System.Collections.Generic;
using System.Linq;
using MR_Reporting_System_Data_Context.Context;
using MR_Reporting_System_Interface.IDataService;
using MR_Reporting_System_Model.DataTransferObjectModel;

namespace MR_Reporting_System_Data_Service.Repository
{
    public class OrdersRepository : GenericRepository<MedicalTechnoEntities, Order>, IOrdersRepository
    {

        public IQueryable<DtoOrders> selectAll(int projectId, string lang)
        {
            var list = new List<DtoOrders>();
            if (lang == "en")
            {
                list = (from q in Context.Orders
                       // where q.projectId == projectId
                        select new DtoOrders
                        {
                            orderTo = q.orderTo,
                            orderTypeId = q.orderTypeId,
                            agentId = q.agentId,
                            subject = q.subject,
                            orderDate = q.orderDate,
                            estimateDate = q.estimateDate,
                            deliverdDate = q.deliverdDate,
                            supervisorApprove = q.supervisorApprove,
                           // isDeliverd = q.isDeliverd,
                            supervisorDate = q.supervisorDate,
                            noOfItems = q.noOfItems,
                            total = q.total,
                            netTotal = q.netTotal,
                            lastEditBy = q.lastEditBy,
                            lastEditDate = q.lastEditDate,
                            deletedBy = q.deletedBy,
                        }).ToList();
            }
            else
            {
                list = (from q in Context.Orders
                       // where q.projectId == projectId
                        select new DtoOrders
                        {
                            orderTo = q.orderTo,
                            orderTypeId = q.orderTypeId,
                            agentId = q.agentId,
                            subject = q.subject,
                            orderDate = q.orderDate,
                            estimateDate = q.estimateDate,
                            deliverdDate = q.deliverdDate,
                            supervisorApprove = q.supervisorApprove,
                           // isDeliverd = q.isDeliverd,
                            supervisorDate = q.supervisorDate,
                            noOfItems = q.noOfItems,
                            total = q.total,
                            netTotal = q.netTotal,
                            lastEditBy = q.lastEditBy,
                            lastEditDate = q.lastEditDate,
                            deletedBy = q.deletedBy,
                        }).ToList();
            } return list.AsQueryable();
        }

        //WriteMethod2

        public DtoOrders selectById(int id, string lang)
        {
            var list = new DtoOrders();
            if (lang == "en")
            {
                list = (from q in Context.Orders
                        where q.id == id
                        select new DtoOrders
                        {
                            orderTo = q.orderTo,
                            orderTypeId = q.orderTypeId,
                            agentId = q.agentId,
                            subject = q.subject,
                            orderDate = q.orderDate,
                            estimateDate = q.estimateDate,
                            deliverdDate = q.deliverdDate,
                            supervisorApprove = q.supervisorApprove,
                           // isDeliverd = q.isDeliverd,
                            supervisorDate = q.supervisorDate,
                            noOfItems = q.noOfItems,
                            total = q.total,
                            netTotal = q.netTotal,
                            lastEditBy = q.lastEditBy,
                            lastEditDate = q.lastEditDate,
                            deletedBy = q.deletedBy,
                        }).FirstOrDefault();
            }
            else
            {
                list = (from q in Context.Orders
                        where q.id == id
                        select new DtoOrders
                        {
                            orderTo = q.orderTo,
                            orderTypeId = q.orderTypeId,
                            agentId = q.agentId,
                            subject = q.subject,
                            orderDate = q.orderDate,
                            estimateDate = q.estimateDate,
                            deliverdDate = q.deliverdDate,
                            supervisorApprove = q.supervisorApprove,
                           // isDeliverd = q.isDeliverd,
                            supervisorDate = q.supervisorDate,
                            noOfItems = q.noOfItems,
                            total = q.total,
                            netTotal = q.netTotal,
                            lastEditBy = q.lastEditBy,
                            lastEditDate = q.lastEditDate,
                            deletedBy = q.deletedBy,
                        }).FirstOrDefault();
            } return list;
        }




    }
}

