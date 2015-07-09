using System.Collections.Generic;
using System.Linq;
using MR_Reporting_System_Data_Context.Context;
using MR_Reporting_System_Interface.IDataService;
using MR_Reporting_System_Model.DataTransferObjectModel;

namespace MR_Reporting_System_Data_Service.Repository
{
    public class AgentAreaRepository : GenericRepository<MedicalTechnoEntities, AgentArea>, IAgentAreaRepository
    {
        public List<DtoAgentArea> SelectAll(string lang, int agentId)
        {
            List<DtoAgentArea> list;
            if (lang == "en")
            {
                list = (from q in Context.AgentAreas
                        where q.AgentId == agentId
                        select new DtoAgentArea
                        {
                            Id = (int)q.AreaId,
                            AgentId = q.AgentId,
                            AreaId = q.AreaId,
                            AreaName = q.Area.Title
                        }).ToList();
            }
            else
            {
                list = (from q in Context.AgentAreas

                        where q.AgentId == agentId

                        select new DtoAgentArea
                        {
                            Id = (int)q.AreaId,
                            AgentId = q.AgentId,
                            AreaId = q.AreaId,
                            AreaName = q.Area.Title
                        }).ToList();
            } return list;
        }

        //WriteMethode4

        public DtoAgentArea SelectById(int id, string lang)
        {
            DtoAgentArea list;
            if (lang == "en")
            {
                list = (from q in Context.AgentAreas
                        where q.Id == id
                        select new DtoAgentArea
                        {
                            AgentId = q.AgentId,
                            AreaId = q.AreaId,
                        }).FirstOrDefault();
            }
            else
            {
                list = (from q in Context.AgentAreas
                        where q.Id == id
                        select new DtoAgentArea
                        {
                            AgentId = q.AgentId,
                            AreaId = q.AreaId,
                        }).FirstOrDefault();
            } return list;
        }

    }
}

