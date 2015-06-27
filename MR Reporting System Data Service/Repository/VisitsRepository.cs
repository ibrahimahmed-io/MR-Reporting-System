using System.Collections.Generic;
using System.Linq;
using MR_Reporting_System_Data_Context.Context;
using MR_Reporting_System_Interface.IDataService;
using MR_Reporting_System_Model.DataTransferObjectModel;
using System;

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
                            Id = q.Id,
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
                            CreationDate = q.CreationDate
                        }).ToList();
            }
            else
            {
                list = (from q in Context.Visits
                        select new DtoVisits
                        {
                            Id = q.Id,
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
                            CreationDate = q.CreationDate
                        }).ToList();
            } return list;
        }

        public DtoVisits SelectById(int id, string lang)
        {
            DtoVisits list;
            if (lang == "en")
            {
                list = (from q in Context.Visits
                        where q.Id == id
                        select new DtoVisits
                        {
                            Id = q.Id,
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
                            CreationDate = q.CreationDate
                        }).FirstOrDefault();
            }
            else
            {
                list = (from q in Context.Visits
                        where q.Id == id
                        select new DtoVisits
                        {
                            Id = q.Id,
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
                            CreationDate = q.CreationDate
                        }).FirstOrDefault();
            } return list;
        }

        public List<DtoVisitCost> visitsCostByAgent(int? AgentId, DateTime? stratDate, DateTime? finishDate)
        {
            List<DtoVisitCost> list;


            if (AgentId != null)
            {
                list = (from agent in Context.Agents.Where(x => x.id == AgentId)
                        select new DtoVisitCost
                        {
                            actualVisits = Context.Visits.Where(x => x.AgentId == AgentId).ToList().Count,
                            EstimateVisits = agent.NoOfVisits ?? 0,
                            actualCost = ((agent.Salary ?? 0) / (Context.Visits.Where(x => x.AgentId == AgentId && x.VisitDate >= stratDate && x.VisitDate <= finishDate).ToList().Count() == 0 ? 1 : Context.Visits.Where(x => x.AgentId == agent.id && x.VisitDate >= stratDate && x.VisitDate <= finishDate).ToList().Count())),
                            estimateCost = (double)((agent.Salary) / (agent.NoOfVisits ?? 1)),
                            agentName = agent.ContactName
                        }).ToList();
            }
            else
            {
                list = (from agent in Context.Agents
                        select new DtoVisitCost
                        {
                            actualVisits = Context.Visits.Where(x => x.AgentId == agent.id).ToList().Count,
                            EstimateVisits = agent.NoOfVisits ?? 0,
                            actualCost = ((agent.Salary ?? 0) / (Context.Visits.Where(x => x.AgentId == agent.id && x.VisitDate >= stratDate && x.VisitDate <= finishDate).ToList().Count() == 0 ? 1 : Context.Visits.Where(x => x.AgentId == agent.id && x.VisitDate >= stratDate && x.VisitDate <= finishDate).ToList().Count())),
                            estimateCost = (double)((agent.Salary) / (agent.NoOfVisits ?? 1)),
                            agentName = agent.ContactName
                        }).ToList();
            }

            return list;
        }

        public List<DtoVisits> visitsByAgent(int? AgentId, DateTime? stratDate, DateTime? finishDate)
        {
            List<DtoVisits> list;


            if (AgentId != null)
            {
                list = (from visit in Context.Visits.Where(x => x.AgentId == AgentId && x.VisitDate >= stratDate && x.VisitDate <= finishDate)
                        select new DtoVisits
                        {
                            AgentName = visit.Agent.ContactName,
                            TypeName = visit.DefaultList.Title,
                            VisitTo = visit.VisitTo,
                            TypeId = visit.TypeId,
                            CreationDate = visit.CreationDate,
                            Notes = visit.Notes,
                            VisitDate = visit.VisitDate,
                            Duration = visit.Duration,
                            Description = visit.Description,
                            DrugsName = visit.Drug.Name,
                            status = (bool)visit.IsMorning ? "Morning" : "Night"
                        }).ToList();
            }
            else
            {
                list = (from visit in Context.Visits.Where(x => x.VisitDate >= stratDate && x.VisitDate <= finishDate)
                        select new DtoVisits
                        {
                            AgentName = visit.Agent.ContactName,
                            TypeName = visit.DefaultList.Title,
                            VisitTo = visit.VisitTo,
                            TypeId = visit.TypeId,
                            CreationDate = visit.CreationDate,
                            Notes = visit.Notes,
                            VisitDate = visit.VisitDate,
                            Duration = visit.Duration,
                            Description = visit.Description,
                            DrugsName = visit.Drug.Name,
                            status = (bool)visit.IsMorning ? "Morning" : "Night"
                        }).ToList();
            }
            foreach (DtoVisits item in list)
            {
                var obj = Context.DefaultLists.FirstOrDefault(x => x.Id == item.TypeId).Action;

                switch (obj)
                {
                    case 1:
                        item.VisitToName = Context.Docotors.FirstOrDefault(x => x.Id == item.VisitTo).Name;
                        break;
                    case 2:
                        item.VisitToName = Context.Pharmacies.FirstOrDefault(x => x.Id == item.VisitTo).Name;
                        break;
                    case 3:
                        item.VisitToName = Context.Hospitals.FirstOrDefault(x => x.Id == item.VisitTo).Name;
                        break;
                    //case 4:
                    //    item.VisitToName = Context.Docotors.FirstOrDefault(x => x.Id == item.VisitTo).Name;
                    //    break;
                }
            }
            return list;
        }

    }

}

