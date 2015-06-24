using System.Collections.Generic;
using System.Linq;
using MR_Reporting_System_Data_Context.Context;
using MR_Reporting_System_Interface.IDataService;
using MR_Reporting_System_Model.DataTransferObjectModel;

namespace MR_Reporting_System_Data_Service.Repository
{
    public class DistributersRepository : GenericRepository<MedicalTechnoEntities, Distributer>, IDistributersRepository
    {
        public List<DtoDistributers> SelectAll(string lang)
        {
            List<DtoDistributers> list;
            if (lang == "en")
            {
                list = (from q in Context.Distributers
                        select new DtoDistributers
                        {
                            Name = q.Name,
                            AreaId = q.AreaId,
                            Address = q.Address,
                            Phone = q.Phone,
                            Code = q.Code,
                            NoOfVisits = q.NoOfVisits,
                            DeletedBy = q.DeletedBy,
                        }).ToList();
            }
            else
            {
                list = (from q in Context.Distributers
                        select new DtoDistributers
                        {
                            Name = q.Name,
                            AreaId = q.AreaId,
                            Address = q.Address,
                            Phone = q.Phone,
                            Code = q.Code,
                            NoOfVisits = q.NoOfVisits,
                            DeletedBy = q.DeletedBy,
                        }).ToList();
            } return list;
        }

        //WriteMethode4

        public DtoDistributers SelectById(int id, string lang)
        {
            DtoDistributers list;
            if (lang == "en")
            {
                list = (from q in Context.Distributers
                        where q.Id == id
                        select new DtoDistributers
                        {
                            Name = q.Name,
                            AreaId = q.AreaId,
                            Address = q.Address,
                            Phone = q.Phone,
                            Code = q.Code,
                            NoOfVisits = q.NoOfVisits,
                            DeletedBy = q.DeletedBy,
                        }).FirstOrDefault();
            }
            else
            {
                list = (from q in Context.Distributers
                        where q.Id == id
                        select new DtoDistributers
                        {
                            Name = q.Name,
                            AreaId = q.AreaId,
                            Address = q.Address,
                            Phone = q.Phone,
                            Code = q.Code,
                            NoOfVisits = q.NoOfVisits,
                            DeletedBy = q.DeletedBy,
                        }).FirstOrDefault();
            } return list;
        }

    }
}

