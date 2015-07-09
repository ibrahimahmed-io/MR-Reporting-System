using System.Collections.Generic;
using System.Linq;
using MR_Reporting_System_Data_Context.Context;
using MR_Reporting_System_Interface.IDataService;
using MR_Reporting_System_Model.DataTransferObjectModel;

namespace MR_Reporting_System_Data_Service.Repository
{
    public class CompaniesRepository : GenericRepository<MedicalTechnoEntities, Companies>, ICompaniesRepository
    {
        public List<DtoCompanies> SelectAll(string lang)
        {
            List<DtoCompanies> list;
            if (lang == "en")
            {
                list = (from q in Context.Companies
                        select new DtoCompanies
                        {
                            Name = q.Name,
                            Description = q.Description,
                            Phone = q.Phone,
                            Email = q.Email,
                            Notes = q.Notes,
                        }).ToList();
            }
            else
            {
                list = (from q in Context.Companies
                        select new DtoCompanies
                        {
                            Name = q.Name,
                            Description = q.Description,
                            Phone = q.Phone,
                            Email = q.Email,
                            Notes = q.Notes,
                        }).ToList();
            } return list;
        }

        //WriteMethode4

        public DtoCompanies SelectById(int id, string lang)
        {
            DtoCompanies list;
            if (lang == "en")
            {
                list = (from q in Context.Companies
                        where q.Id == id
                        select new DtoCompanies
                        {
                            Name = q.Name,
                            Description = q.Description,
                            Phone = q.Phone,
                            Email = q.Email,
                            Notes = q.Notes,
                        }).FirstOrDefault();
            }
            else
            {
                list = (from q in Context.Companies
                        where q.Id == id
                        select new DtoCompanies
                        {
                            Name = q.Name,
                            Description = q.Description,
                            Phone = q.Phone,
                            Email = q.Email,
                            Notes = q.Notes,
                        }).FirstOrDefault();
            } return list;
        }

    }
}

