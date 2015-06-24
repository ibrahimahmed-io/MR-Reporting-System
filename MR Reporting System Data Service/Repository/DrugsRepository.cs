using System.Collections.Generic;
using System.Linq;
using MR_Reporting_System_Data_Context.Context;
using MR_Reporting_System_Interface.IDataService;
using MR_Reporting_System_Model.DataTransferObjectModel;

namespace MR_Reporting_System_Data_Service.Repository
{
    public class DrugsRepository : GenericRepository<MedicalTechnoEntities, Drug>, IDrugsRepository
    {
        public List<DtoDrugs> SelectAll(string lang)
        {
            List<DtoDrugs> list;
            if (lang == "en")
            {
                list = (from q in Context.Drugs
                        select new DtoDrugs
                        {
                            Name = q.Name,
                            Description = q.Description,
                            Code = q.Code,
                            Price = q.Price,
                            SectionId = q.SectionId,
                            Notes = q.Notes,
                            CompanyId = q.CompanyId,
                            DeletedBy = q.DeletedBy,
                        }).ToList();
            }
            else
            {
                list = (from q in Context.Drugs
                        select new DtoDrugs
                        {
                            Name = q.Name,
                            Description = q.Description,
                            Code = q.Code,
                            Price = q.Price,
                            SectionId = q.SectionId,
                            Notes = q.Notes,
                            CompanyId = q.CompanyId,
                            DeletedBy = q.DeletedBy,
                        }).ToList();
            } return list;
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

