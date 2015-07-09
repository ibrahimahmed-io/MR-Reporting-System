using System.Collections.Generic;
using System.Linq;
using MR_Reporting_System_Data_Context.Context;
using MR_Reporting_System_Interface.IDataService;
using MR_Reporting_System_Model.DataTransferObjectModel;

namespace MR_Reporting_System_Data_Service.Repository
{
    public class OrdersItemsRepository : GenericRepository<MedicalTechnoEntities, ordersItem>, IOrderItemsRepository
    {

        public IQueryable<DtoOrdersItems> selectAll(int projectId, string lang)
        {
            var list = new List<DtoOrdersItems>();
            if (lang == "en")
            {
                list = (from q in Context.ordersItems
                        //where q.projectId == projectId
                        select new DtoOrdersItems
                        {
                            description = q.description,
                            itemCode = q.itemCode,
                            unitPrice = q.unitPrice,
                            quantity = q.quantity,
                            total = q.total,
                            drugsId = q.drugsId,
                        }).ToList();
            }
            else
            {
                list = (from q in Context.ordersItems
                        //where q.projectId == projectId
                        select new DtoOrdersItems
                        {
                            description = q.description,
                            itemCode = q.itemCode,
                            unitPrice = q.unitPrice,
                            quantity = q.quantity,
                            total = q.total,
                            drugsId = q.drugsId,
                        }).ToList();
            } return list.AsQueryable();
        }

        //WriteMethod2

        public DtoOrdersItems selectById(int id, string lang)
        {
            var list = new DtoOrdersItems();
            if (lang == "en")
            {
                list = (from q in Context.ordersItems
                        where q.id == id
                        select new DtoOrdersItems
                        {
                            description = q.description,
                            itemCode = q.itemCode,
                            unitPrice = q.unitPrice,
                            quantity = q.quantity,
                            total = q.total,
                            drugsId = q.drugsId,
                        }).FirstOrDefault();
            }
            else
            {
                list = (from q in Context.ordersItems
                        where q.id == id
                        select new DtoOrdersItems
                        {
                            description = q.description,
                            itemCode = q.itemCode,
                            unitPrice = q.unitPrice,
                            quantity = q.quantity,
                            total = q.total,
                            drugsId = q.drugsId,
                        }).FirstOrDefault();
            } return list;
        }




    }
}

