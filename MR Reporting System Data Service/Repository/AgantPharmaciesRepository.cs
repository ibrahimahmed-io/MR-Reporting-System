using System.Collections.Generic;
using System.Linq;
using MR_Reporting_System_Data_Context.Context;
using MR_Reporting_System_Interface.IDataService;
using MR_Reporting_System_Model.DataTransferObjectModel;

namespace MR_Reporting_System_Data_Service.Repository
{
    public class AgentpharmaciesRepository : GenericRepository<MedicalTechnoEntities, AgentPharmacy>, IAgentPharmaciesRepository
    {
        public List<DtoAgentPharmacies> SelectAll(string lang)
        {
            List<DtoAgentPharmacies> list;
            if (lang == "en")
            {
                list = (from q in Context.AgentPharmacies
                        select new DtoAgentPharmacies
                        {
                            AgentId = q.AgentId,
                            PharmacyId = q.PharmacyId,
                        }).ToList();
            }
            else
            {
                list = (from q in Context.AgentPharmacies
                        select new DtoAgentPharmacies
                        {
                            AgentId = q.AgentId,
                            PharmacyId = q.PharmacyId,
                        }).ToList();
            } return list;
        }

        //WriteMethode4

        public DtoAgentPharmacies SelectById(int id, string lang)
        {
            DtoAgentPharmacies list;
            if (lang == "en")
            {
                list = (from q in Context.AgentPharmacies
                        where q.Id == id
                        select new DtoAgentPharmacies
                        {
                            AgentId = q.AgentId,
                            PharmacyId = q.PharmacyId,
                        }).FirstOrDefault();
            }
            else
            {
                list = (from q in Context.AgentPharmacies
                        where q.Id == id
                        select new DtoAgentPharmacies
                        {
                            AgentId = q.AgentId,
                            PharmacyId = q.PharmacyId,
                        }).FirstOrDefault();
            } return list;
        }

    }
}

