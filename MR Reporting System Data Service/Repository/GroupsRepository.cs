using System.Collections.Generic;
using System.Linq;
using MR_Reporting_System_Data_Context.Context;
using MR_Reporting_System_Interface.IDataService;
using MR_Reporting_System_Model.DataTransferObjectModel;

namespace MR_Reporting_System_Data_Service.Repository
{
    public class GroupsRepository : GenericRepository<MedicalTechnoEntities, Group>, IGroupsRepository
    {
        public List<DtoGroups> SelectAll(string lang)
        {
            List<DtoGroups> list;
            if (lang == "en")
            {
                list = (from q in Context.Groups
                        select new DtoGroups
                        {
                            Id = q.Id,
                            GroupName = q.GroupName,
                        }).ToList();
            }
            else
            {
                list = (from q in Context.Groups
                        select new DtoGroups
                        {
                            Id = q.Id,
                            GroupName = q.GroupName,
                        }).ToList();
            } return list;
        }

        //WriteMethode4

        public DtoGroups SelectById(int id, string lang)
        {
            DtoGroups list;
            if (lang == "en")
            {
                list = (from q in Context.Groups
                        where q.Id == id
                        select new DtoGroups
                        {
                            GroupName = q.GroupName,
                        }).FirstOrDefault();
            }
            else
            {
                list = (from q in Context.Groups
                        where q.Id == id
                        select new DtoGroups
                        {
                            GroupName = q.GroupName,
                        }).FirstOrDefault();
            } return list;
        }

    }
}

