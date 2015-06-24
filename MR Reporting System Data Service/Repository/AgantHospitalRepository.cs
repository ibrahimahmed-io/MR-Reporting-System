using System.Collections.Generic;
using System.Linq;
using MR_Reporting_System_Data_Context.Context;
using MR_Reporting_System_Interface.IDataService;
using MR_Reporting_System_Model.DataTransferObjectModel;

namespace MR_Reporting_System_Data_Service.Repository
{
    public class AgentHospitalRepository : GenericRepository<MedicalTechnoEntities, AgentHospital>, IAgentHospitalRepository
    {
        public List<DtoAgentHospital> SelectAll(string lang)
        {
            List<DtoAgentHospital> list;
            if (lang == "en")
            {
                list = (from q in Context.AgentHospitals
                        select new DtoAgentHospital
                        {
                            AgentId = q.AgentId,
                            HospitalId = q.HospitalId,
                        }).ToList();
            }
            else
            {
                list = (from q in Context.AgentHospitals
                        select new DtoAgentHospital
                        {
                            AgentId = q.AgentId,
                            HospitalId = q.HospitalId,
                        }).ToList();
            } return list;
        }

        //WriteMethode4

        public DtoAgentHospital SelectById(int id, string lang)
        {
            DtoAgentHospital list;
            if (lang == "en")
            {
                list = (from q in Context.AgentHospitals
                        where q.Id == id
                        select new DtoAgentHospital
                        {
                            AgentId = q.AgentId,
                            HospitalId = q.HospitalId,
                        }).FirstOrDefault();
            }
            else
            {
                list = (from q in Context.AgentHospitals
                        where q.Id == id
                        select new DtoAgentHospital
                        {
                            AgentId = q.AgentId,
                            HospitalId = q.HospitalId,
                        }).FirstOrDefault();
            } return list;
        }

    }
}

