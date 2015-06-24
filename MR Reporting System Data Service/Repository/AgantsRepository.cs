
using System.Collections.Generic;
using System.Linq;
using MR_Reporting_System_Data_Context.Context;
using MR_Reporting_System_Interface.IDataService;
using MR_Reporting_System_Model.DataTransferObjectModel;

namespace MR_Reporting_System_Data_Service.Repository
{
    public class AgentsRepository : GenericRepository<MedicalTechnoEntities, Agent>, IAgentsRepository
    {
        public List<DtoAgents> SelectAll(string lang)
        {
            List<DtoAgents> list;
            if (lang == "en")
            {
                list = (from q in Context.Agents
                        select new DtoAgents
                        {
                            UserName = q.UserName,
                            PassWord = q.PassWord,
                            ContactName = q.ContactName,
                            PositionId = q.PostionId,
                            AreaId = q.AreaId,
                            Address = q.Address,
                            Phone = q.Phone,
                            Email = q.Email,
                            GroupId = q.GroupId,
                            Salary = q.Salary,
                            NoOfVisits = q.NoOfVisits,
                            SupervisorId = q.SupervisorId,
                            Code = q.Code,
                            UserType = q.UserType,
                        }).ToList();
            }
            else
            {
                list = (from q in Context.Agents
                        select new DtoAgents
                        {
                            UserName = q.UserName,
                            PassWord = q.PassWord,
                            ContactName = q.ContactName,
                            PositionId = q.PostionId,
                            AreaId = q.AreaId,
                            Address = q.Address,
                            Phone = q.Phone,
                            Email = q.Email,
                            GroupId = q.GroupId,
                            Salary = q.Salary,
                            NoOfVisits = q.NoOfVisits,
                            SupervisorId = q.SupervisorId,
                            Code = q.Code,
                            UserType = q.UserType,
                        }).ToList();
            } return list;
        }

        //WriteMethode4

        public DtoAgents SelectById(int id, string lang)
        {
            DtoAgents list;
            if (lang == "en")
            {
                list = (from q in Context.Agents
                        where q.id == id
                        select new DtoAgents
                        {
                            UserName = q.UserName,
                            PassWord = q.PassWord,
                            ContactName = q.ContactName,
                            PositionId = q.PostionId,
                            AreaId = q.AreaId,
                            Address = q.Address,
                            Phone = q.Phone,
                            Email = q.Email,
                            GroupId = q.GroupId,
                            Salary = q.Salary,
                            NoOfVisits = q.NoOfVisits,
                            SupervisorId = q.SupervisorId,
                            Code = q.Code,
                            UserType = q.UserType,
                        }).FirstOrDefault();
            }
            else
            {
                list = (from q in Context.Agents
                        where q.id == id
                        select new DtoAgents
                        {
                            UserName = q.UserName,
                            PassWord = q.PassWord,
                            ContactName = q.ContactName,
                            PositionId = q.PostionId,
                            AreaId = q.AreaId,
                            Address = q.Address,
                            Phone = q.Phone,
                            Email = q.Email,
                            GroupId = q.GroupId,
                            Salary = q.Salary,
                            NoOfVisits = q.NoOfVisits,
                            SupervisorId = q.SupervisorId,
                            Code = q.Code,
                            UserType = q.UserType,
                        }).FirstOrDefault();
            } return list;
        }

    }
}

