using System.Collections.Generic;
using System.Linq;
using MR_Reporting_System_Data_Context.Context;
using MR_Reporting_System_Interface.IDataService;
using MR_Reporting_System_Model.DataTransferObjectModel;

namespace MR_Reporting_System_Data_Service.Repository
{
    public class AgentDistributerRepository : GenericRepository<MedicalTechnoEntities, AgentDistributer>, IAgentDistributerRepository
    {
        public List<DtoAgentDistributer> SelectAll(string lang)
        {
            List<DtoAgentDistributer> list;
            if (lang == "en")
            {
                list = (from q in Context.AgentDistributers
                        select new DtoAgentDistributer
                        {
                            AgentId = q.AgentId,
                            DistributerId = q.DistributerId,
                        }).ToList();
            }
            else
            {
                list = (from q in Context.AgentDistributers
                        select new DtoAgentDistributer
                        {
                            AgentId = q.AgentId,
                            DistributerId = q.DistributerId,
                        }).ToList();
            } return list;
        }

        //WriteMethode4

        public DtoAgentDistributer SelectById(int id, string lang)
        {
            DtoAgentDistributer list;
            if (lang == "en")
            {
                list = (from q in Context.AgentDistributers
                        where q.Id == id
                        select new DtoAgentDistributer
                        {
                            AgentId = q.AgentId,
                            DistributerId = q.DistributerId,
                        }).FirstOrDefault();
            }
            else
            {
                list = (from q in Context.AgentDistributers
                        where q.Id == id
                        select new DtoAgentDistributer
                        {
                            AgentId = q.AgentId,
                            DistributerId = q.DistributerId,
                        }).FirstOrDefault();
            } return list;
        }

    }
}

