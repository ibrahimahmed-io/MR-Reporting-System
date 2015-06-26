using System.Collections.Generic;
using System.Linq;
using MR_Reporting_System_Data_Context.Context;
using MR_Reporting_System_Interface.IDataService;
using MR_Reporting_System_Model.DataTransferObjectModel;

namespace MR_Reporting_System_Data_Service.Repository
{
    public class DocotorsRepository : GenericRepository<MedicalTechnoEntities, Docotor>, IDocotorsRepository
    {
        public List<DtoDocotors> SelectAll(string lang)
        {
            List<DtoDocotors> list;
            if (lang == "en")
            {
                list = (from q in Context.Docotors
                        where q.DeletedBy == null
                        select new DtoDocotors
                        {
                            Id = q.Id,
                            Name = q.Name,
                            SpecializeId = q.SpecializeId,
                            IsMorning = q.IsMorning,
                            Address = q.Address,
                            AreaId = q.AreaId,
                            ClassTypeId = q.ClassTypeId,
                            NoOfVisits = q.NoOfVisits,
                            AreaName = q.Area.Title,
                            Phone = q.Phone,
                            Telephone = q.Telephone,
                            Email = q.Email,
                            Code = q.Code
                        }).ToList();
            }
            else
            {
                list = (from q in Context.Docotors
                        where q.DeletedBy == null
                        select new DtoDocotors
                        {
                            Id = q.Id,
                            Name = q.Name,
                            SpecializeId = q.SpecializeId,
                            IsMorning = q.IsMorning,
                            Address = q.Address,
                            AreaId = q.AreaId,
                            ClassTypeId = q.ClassTypeId,
                            NoOfVisits = q.NoOfVisits,
                            AreaName = q.Area.Title,
                            Phone = q.Phone,
                            Telephone = q.Telephone,
                            Email = q.Email,
                            Code = q.Code
                        }).ToList();
            } return list;
        }

        //WriteMethode4

        public DtoDocotors SelectById(int id, string lang)
        {
            DtoDocotors list;
            if (lang == "en")
            {
                list = (from q in Context.Docotors
                        where q.Id == id
                        select new DtoDocotors
                        {
                            Id = q.Id,
                            Name = q.Name,
                            SpecializeId = q.SpecializeId,
                            IsMorning = q.IsMorning,
                            Address = q.Address,
                            AreaId = q.AreaId,
                            ClassTypeId = q.ClassTypeId,
                            NoOfVisits = q.NoOfVisits,
                            Phone = q.Phone,
                            Telephone = q.Telephone,
                            Email = q.Email,
                            Code = q.Code
                        }).FirstOrDefault();
            }
            else
            {
                list = (from q in Context.Docotors
                        where q.Id == id
                        select new DtoDocotors
                        {
                            Id = q.Id,
                            Name = q.Name,
                            SpecializeId = q.SpecializeId,
                            IsMorning = q.IsMorning,
                            Address = q.Address,
                            AreaId = q.AreaId,
                            ClassTypeId = q.ClassTypeId,
                            NoOfVisits = q.NoOfVisits,
                            Phone = q.Phone,
                            Telephone = q.Telephone,
                            Email = q.Email,
                            Code = q.Code
                        }).FirstOrDefault();
            } return list;
        }

    }
}

