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
                            EstimateVisits = agent.NoOfVisits,
                            actualCost = ((Context.Visits.Where(x => x.AgentId == AgentId).ToList().Count) / agent.Salary ?? 0),
                            estimateCost = (double)((agent.NoOfVisits) / (agent.Salary)),
                            agentName = agent.ContactName
                        }).ToList();
            }
            else
            {
                list = (from agent in Context.Agents
                        select new DtoVisitCost
                        {
                            actualVisits = Context.Visits.Where(x => x.AgentId == agent.id).ToList().Count,
                            EstimateVisits = agent.NoOfVisits,
                            actualCost = ((Context.Visits.Where(x => x.AgentId == agent.id).ToList().Count) / agent.Salary ?? 0),
                            estimateCost = (double)((agent.NoOfVisits) / (agent.Salary)),
                            agentName = agent.ContactName
                        }).ToList();
            }

            return list;
        }


    }
   
}

