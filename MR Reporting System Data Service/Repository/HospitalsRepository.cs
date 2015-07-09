using System.Collections.Generic;
using System.Linq;
using MR_Reporting_System_Data_Context.Context;
using MR_Reporting_System_Interface.IDataService;
using MR_Reporting_System_Model.DataTransferObjectModel;

namespace MR_Reporting_System_Data_Service.Repository
{
    public class HospitalsRepository : GenericRepository<MedicalTechnoEntities, Hospitals>, IHospitalsRepository
    {
        public List<DtoHospitals> SelectAll(string lang)
        {
            List<DtoHospitals> list;
            if (lang == "en")
            {
                list = (from q in Context.Hospitals
                        where q.DeletedBy == null
                        select new DtoHospitals
                        {
                            Id = q.Id,
                            Name = q.Name,
                            AreaId = q.AreaId,
                            AreaName = q.Areas.Title,
                            Address = q.Address,
                            Phone = q.Phone,
                            Email = q.Email,
                            typeName = q.Type == 1 ? "public" : "private",
                            Type = q.Type,
                            Code = q.Code 
                        }).ToList();
            }
            else
            {
                list = (from q in Context.Hospitals
                        where q.DeletedBy == null
                        select new DtoHospitals
                        {
                            Id = q.Id,
                            Name = q.Name,
                            AreaId = q.AreaId,
                            Address = q.Address,
                            AreaName = q.Areas.Title,
                            typeName = q.Type == 1 ? "public" : "private",
                            Phone = q.Phone,
                            Email = q.Email,
                            Type = q.Type,

                            Code = q.Code 
                        }).ToList();
            } return list;
        }

        //WriteMethode4

        public DtoHospitals SelectById(int id, string lang)
        {
            DtoHospitals list;
            if (lang == "en")
            {
                list = (from q in Context.Hospitals
                        where q.Id == id
                        select new DtoHospitals
                        {
                            Id = q.Id,
                            Name = q.Name,
                            AreaId = q.AreaId,
                            Address = q.Address,
                            Phone = q.Phone,
                            Email = q.Email,
                            Type = q.Type,
                            Code = q.Code,
                            DeletedBy = q.DeletedBy,
                        }).FirstOrDefault();
            }
            else
            {
                list = (from q in Context.Hospitals
                        where q.Id == id
                        select new DtoHospitals
                        {
                            Id = q.Id,
                            Name = q.Name,
                            AreaId = q.AreaId,
                            Address = q.Address,
                            Phone = q.Phone,
                            Email = q.Email,
                            Type = q.Type,
                            Code = q.Code,
                            DeletedBy = q.DeletedBy,
                        }).FirstOrDefault();
            } return list;
        }

    }
}

