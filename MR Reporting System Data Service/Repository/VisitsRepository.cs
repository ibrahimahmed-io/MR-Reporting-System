using System.Collections.Generic;
using System.Linq;
using MR_Reporting_System_Data_Context.Context;
using MR_Reporting_System_Interface.IDataService;
using MR_Reporting_System_Model.DataTransferObjectModel;

namespace MR_Reporting_System_Data_Service.Repository
{
    public class VisitsRepository : GenericRepository<MedicalTechnoEntities, Visit>, IVisitsRepository
    {
        public List<DtoVisits> SelectAll(string lang)
        {
            List<DtoVisits> list;
            if (lang == "en")
            {
                list = (from q in Context.Visits
                        select new DtoVisits
                        {
                            AgentId = q.AgentId,
                            DrugsId = q.DrugsId,
                            TypeId = q.TypeId,
                            VisitTo = q.VisitTo,
                            VisitDate = q.VisitDate,
                            Duration = q.Duration,
                            Description = q.Description,
                            IsMorning = q.IsMorning,
                            Notes = q.Notes,
                            LastEditBy = q.LastEditBy,
                            LastEditDate = q.LastEditDate,
                            CreationDate = q.CreationDate,
                        }).ToList();
            }
            else
            {
                list = (from q in Context.Visits
                        select new DtoVisits
                        {
                            AgentId = q.AgentId,
                            DrugsId = q.DrugsId,
                            TypeId = q.TypeId,
                            VisitTo = q.VisitTo,
                            VisitDate = q.VisitDate,
                            Duration = q.Duration,
                            Description = q.Description,
                            IsMorning = q.IsMorning,
                            Notes = q.Notes,
                            LastEditBy = q.LastEditBy,
                            LastEditDate = q.LastEditDate,
                            CreationDate = q.CreationDate,
                        }).ToList();
            } return list;
        }

        //WriteMethode4

        public DtoVisits SelectById(int id, string lang)
        {
            DtoVisits list;
            if (lang == "en")
            {
                list = (from q in Context.Visits
                        where q.Id == id
                        select new DtoVisits
                        {
                            AgentId = q.AgentId,
                            DrugsId = q.DrugsId,
                            TypeId = q.TypeId,
                            VisitTo = q.VisitTo,
                            VisitDate = q.VisitDate,
                            Duration = q.Duration,
                            Description = q.Description,
                            IsMorning = q.IsMorning,
                            Notes = q.Notes,
                            LastEditBy = q.LastEditBy,
                            LastEditDate = q.LastEditDate,
                            CreationDate = q.CreationDate,
                        }).FirstOrDefault();
            }
            else
            {
                list = (from q in Context.Visits
                        where q.Id == id
                        select new DtoVisits
                        {
                            AgentId = q.AgentId,
                            DrugsId = q.DrugsId,
                            TypeId = q.TypeId,
                            VisitTo = q.VisitTo,
                            VisitDate = q.VisitDate,
                            Duration = q.Duration,
                            Description = q.Description,
                            IsMorning = q.IsMorning,
                            Notes = q.Notes,
                            LastEditBy = q.LastEditBy,
                            LastEditDate = q.LastEditDate,
                            CreationDate = q.CreationDate,
                        }).FirstOrDefault();
            } return list;
        }

    }
}

