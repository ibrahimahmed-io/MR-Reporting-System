using System.Collections.Generic;
using System.Linq;
using MR_Reporting_System_Data_Context.Context;
using MR_Reporting_System_Interface.IDataService;
using MR_Reporting_System_Model.DataTransferObjectModel;

namespace MR_Reporting_System_Data_Service.Repository
{
    public class PharmaciesRepository : GenericRepository<MedicalTechnoEntities, Pharmacies>, IPharmaciesRepository
    {
        public List<DtoPharmacies> SelectAll(string lang)
        {
            List<DtoPharmacies> list;
            if (lang == "en")
            {
                list = (from q in Context.Pharmacies
                        //where q.DeletedBy == null
                        select new DtoPharmacies
                        {
                            Id=q.Id,
                            Name = q.Name,
                            AreaId = q.AreaId,
                            Address = q.Address,
                            Phone = q.Phone,
                            AreaName = q.Areas.Title,
                            Email = q.Email,
                            OwnerName = q.OwnerName,
                            OwnerPhone = q.OwnerPhone,
                        }).ToList();
            }
            else
            {
                list = (from q in Context.Pharmacies
                        //where q.DeletedBy == null
                        select new DtoPharmacies
                        {
                            Id = q.Id,
                            Name = q.Name,
                            AreaId = q.AreaId,
                            AreaName = q.Areas.Title,
                            Address = q.Address,
                            Phone = q.Phone,
                            Email = q.Email,
                            OwnerName = q.OwnerName,
                            OwnerPhone = q.OwnerPhone,
                        }).ToList();
            } return list;
        }

        //WriteMethode4

        public DtoPharmacies SelectById(int id, string lang)
        {
            DtoPharmacies list;
            if (lang == "en")
            {
                list = (from q in Context.Pharmacies
                        where q.Id == id
                        select new DtoPharmacies
                        {
                            Id = q.Id,
                            Name = q.Name,
                            AreaId = q.AreaId,
                            Address = q.Address,
                            Phone = q.Phone,
                            Email = q.Email,
                            OwnerName = q.OwnerName,
                            OwnerPhone = q.OwnerPhone,
                        }).FirstOrDefault();
            }
            else
            {
                list = (from q in Context.Pharmacies
                        where q.Id == id
                        select new DtoPharmacies
                        {
                            Id = q.Id,
                            Name = q.Name,
                            AreaId = q.AreaId,
                            Address = q.Address,
                            Phone = q.Phone,
                            Email = q.Email,
                            OwnerName = q.OwnerName,
                            OwnerPhone = q.OwnerPhone,
                        }).FirstOrDefault();
            } return list;
        }

    }
}

