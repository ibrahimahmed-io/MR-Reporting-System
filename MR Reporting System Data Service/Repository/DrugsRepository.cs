using System.Collections.Generic;
using System.Linq;
using MR_Reporting_System_Data_Context.Context;
using MR_Reporting_System_Interface.IDataService;
using MR_Reporting_System_Model.DataTransferObjectModel;

namespace MR_Reporting_System_Data_Service.Repository
{
    public class DrugsRepository : GenericRepository<MedicalTechnoEntities, Drugs>, IDrugsRepository
    {
        public List<DtoDrugs> SelectAll(string lang)
        {
            var list = (from q in Context.Drugs.Include("DefaultList")
                where q.DeletedBy == null
                select new DtoDrugs
                {
                    Id = q.Id,
                    Name = q.Name,
                    Description = q.Description,
                    Code = q.Code,
                    Price = q.Price,
                    SectionName = q.DefaultLists.Title,
                    Notes = q.Notes,
                    CompanyName = q.Companies.Name
                }).ToList();

            return list;
        }

        //WriteMethode4

        public DtoDrugs SelectById(int id, string lang)
        {
            DtoDrugs list;
            if (lang == "en")
            {
                list = (from q in Context.Drugs
                        where q.Id == id
                        select new DtoDrugs
                        {
                            Id = q.Id,
                            Name = q.Name,
                            Description = q.Description,
                            Code = q.Code,
                            Price = q.Price,
                            SectionId = q.SectionId,
                            Notes = q.Notes,
                            CompanyId = q.CompanyId,
                            DeletedBy = q.DeletedBy,
                        }).FirstOrDefault();
            }
            else
            {
                list = (from q in Context.Drugs
                        where q.Id == id
                        select new DtoDrugs
                        {
                            Id = q.Id,
                            Name = q.Name,
                            Description = q.Description,
                            Code = q.Code,
                            Price = q.Price,
                            SectionId = q.SectionId,
                            Notes = q.Notes,
                            CompanyId = q.CompanyId,
                            DeletedBy = q.DeletedBy,
                        }).FirstOrDefault();
            } return list;
        }

    }
}

