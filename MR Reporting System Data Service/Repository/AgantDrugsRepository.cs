using System.Collections.Generic;
using System.Linq;
using MR_Reporting_System_Data_Context.Context;
using MR_Reporting_System_Interface.IDataService;
using MR_Reporting_System_Model.DataTransferObjectModel;

namespace MR_Reporting_System_Data_Service.Repository
{
    public class AgentDrugsRepository : GenericRepository<MedicalTechnoEntities, AgentDrug>, IAgentDrugsRepository
    {
        public List<DtoAgentDrugs> SelectAll(string lang, int agentId)
        {
            List<DtoAgentDrugs> list;
            if (lang == "en")
            {
                list = (from q in Context.AgentDrugs
                        where q.AgentId == agentId
                        select new DtoAgentDrugs
                        {
                            Id = (int)q.DrugsId,
                            AgentId = q.AgentId,
                            DrugsId = q.DrugsId,
                            DrugsName = q.Drug.Name
                        }).ToList();
            }
            else
            {
                list = (from q in Context.AgentDrugs
                        where q.AgentId == agentId
                        select new DtoAgentDrugs
                        {
                            Id = (int)q.DrugsId,
                            AgentId = q.AgentId,
                            DrugsId = q.DrugsId,
                            DrugsName = q.Drug.Name
                        }).ToList();
            } return list;
        }

        //WriteMethode4

        public DtoAgentDrugs SelectById(int id, string lang)
        {
            DtoAgentDrugs list;
            if (lang == "en")
            {
                list = (from q in Context.AgentDrugs
                        where q.Id == id
                        select new DtoAgentDrugs
                        {
                            AgentId = q.AgentId,
                            DrugsId = q.DrugsId,
                        }).FirstOrDefault();
            }
            else
            {
                list = (from q in Context.AgentDrugs
                        where q.Id == id
                        select new DtoAgentDrugs
                        {
                            AgentId = q.AgentId,
                            DrugsId = q.DrugsId,
                        }).FirstOrDefault();
            } return list;
        }

    }
}

