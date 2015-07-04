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
            var list = (from q in
                            Context.Visits.Include("Agent.ContactName").Include("Drug.Name").Include("DefaultList.Title")
                        let type = q.DefaultList.Action
                        let visitee =
                            (type == 1)
                                ? Context.Docotors.Where(x => x.Id == q.VisitTo).Select(x => x.Name).FirstOrDefault()
                                : (type == 2)
                                    ? Context.Pharmacies.Where(x => x.Id == q.VisitTo).Select(x => x.Name).FirstOrDefault()
                                    : Context.Hospitals.Where(x => x.Id == q.VisitTo).Select(x => x.Name).FirstOrDefault()
                        select new DtoVisits
                        {
                            Id = q.Id,
                            AgentName = q.Agent.ContactName,
                            DrugsName = q.Drug.Name,
                            TypeName = q.DefaultList.Title,
                            VisitToName = visitee,
                            VisitDate = q.VisitDate,
                            Duration = q.Duration,
                            Description = q.Description,
                            IsMorning = q.IsMorning,
                            Notes = q.Notes,
                            LastEditByName = q.Agent1.ContactName,
                            LastEditDate = q.LastEditDate,
                            CreationDate = q.CreationDate
                        }).ToList();

            return list;
        }

        public DtoVisitCountForDrugReport SelectVisitsForDrugReport(int drugId)
        {
            var doctorsVisitCount = (from q in Context.Visits
                                     let type = q.DefaultList.Action
                                     where type == 1 && q.DrugsId == drugId
                                     select q.Id).Count();

            var pharmaciesVisitCount = (from q in Context.Visits
                                        let type = q.DefaultList.Action
                                        where type == 2 && q.DrugsId == drugId
                                        select q.Id).Count();

            var hospitalsVisitCount = (from q in Context.Visits
                                       let type = q.DefaultList.Action
                                       where type == 3 && q.DrugsId == drugId
                                       select q.Id).Count();

            var result = new DtoVisitCountForDrugReport
            {
                Doctors = doctorsVisitCount,
                Hospitals = hospitalsVisitCount,
                Pharmacies = pharmaciesVisitCount
            };

            return result;
        }

        public DtoMorningLateVisitCountForDrugReport SelectVisitsMorningCountForDrugReport(int drugId)
        {
            var isMorning = (from q in Context.Visits
                             where q.DrugsId == drugId && q.IsMorning == true
                             select q.Id).Count();

            var isLate = (from q in Context.Visits
                          where q.DrugsId == drugId && q.IsMorning == false
                          select q.Id).Count();

            var result = new DtoMorningLateVisitCountForDrugReport
            {
                Morning = isMorning,
                Late = isLate
            };

            return result;
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

        public List<DtoVisits> visitsByArea(int? AreaId, DateTime? stratDate, DateTime? finishDate)
        {
            List<DtoVisits> list;


            if (AreaId == null)
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
            else
            {
                var result = (from area in Context.AgentAreas.Where(x => x.AreaId == AreaId)

                              select area.AgentId).FirstOrDefault();

                list = (from visit in Context.Visits.Where(x => x.VisitDate >= stratDate && x.VisitDate <= finishDate && result == x.AgentId)
                        let areaName = Context.AgentAreas.Where(x => x.AreaId == AreaId).Select(x => x.Area.Title).FirstOrDefault()
                        select new DtoVisits
                        {
                            AgentName = visit.Agent.ContactName,
                            areaName = areaName,
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


        public List<DtoSummaryWords> alertsCount()
        {
            List<DtoSummaryWords> list = new List<DtoSummaryWords>();

            DateTime? currentDate = DateTime.Now.Date;


            var listWeek = (from agent in Context.Visits

                            select new DtoVisits
                            {
                                Id = agent.Id,
                                VisitDate = agent.VisitDate
                            }).ToList().Where(x => x.VisitDate >= currentDate.Value.AddDays(-7)).ToList();

            var list2Week = (from agent in Context.Visits

                             select new DtoVisits
                             {
                                 Id = agent.Id,
                                 VisitDate = agent.VisitDate
                             }).ToList().Where(x => x.VisitDate >= currentDate.Value.AddDays(-14) && x.VisitDate <= currentDate.Value.AddDays(-7)
                             ).ToList();

            var listMoreWeek = (from agent in Context.Visits

                                select new DtoVisits
                                {
                                    Id = agent.Id,
                                    VisitDate = agent.VisitDate
                                }).ToList().Where(x => x.VisitDate <= currentDate.Value.AddDays(-14)).ToList();

            list.Add(new DtoSummaryWords { item = "This Week", total = list.Count() });

            list.Add(new DtoSummaryWords { item = "Two Week", total = list2Week.Count() });

            list.Add(new DtoSummaryWords { item = "More Two Week", total = listMoreWeek.Count() });

            return list;
        }

        public List<DtoVisits> alertsCountDetail(string listType)
        {
            List<DtoVisits> list = new List<DtoVisits>();

            DateTime? currentDate = DateTime.Now.Date;
            switch (listType)
            {
                case "This Week":
                    list = (from visit in Context.Visits
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
                            }).ToList().Where(x => x.VisitDate >= currentDate.Value.AddDays(-7)).ToList();
                    break;

                case "Two Week":
                    list = (from visit in Context.Visits
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
                            }).ToList().Where(x => x.VisitDate >= currentDate.Value.AddDays(-14)).ToList();
                    break;

                case "More Two Week":
                    list = (from visit in Context.Visits
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
                            }).ToList().Where(x => x.VisitDate <= currentDate.Value.AddDays(-14)).ToList();
                    break;
            }




            return list;
        }
    }

}

