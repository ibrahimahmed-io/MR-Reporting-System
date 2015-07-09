using System.Collections.Generic;
using System.Linq;
using MR_Reporting_System_Data_Context.Context;
using MR_Reporting_System_Interface.IDataService;
using MR_Reporting_System_Model.DataTransferObjectModel;

namespace MR_Reporting_System_Data_Service.Repository
{
    public class GroupPermissionsRepository : GenericRepository<MedicalTechnoEntities, GroupPermissions>, IGroupPermissionsRepository
    {
        public List<DtoGroupPermissions> SelectAll(int groupId, string lang)
        {
            List<DtoGroupPermissions> list;
            if (lang == "en")
            {
                list = (from q in Context.GroupPermissions
                        where q.GroupId == groupId
                        select new DtoGroupPermissions
                        {
                            GroupId = q.GroupId,
                            PermissionCode = q.PermissionCode,
                            Value = q.Value,
                        }).ToList();
            }
            else
            {
                list = (from q in Context.GroupPermissions
                        select new DtoGroupPermissions
                        {
                            GroupId = q.GroupId,
                            PermissionCode = q.PermissionCode,
                            Value = q.Value,
                        }).ToList();
            } return list;
        }

        public List<int?> PermissionWithNumbersByGroupIdArray(int groupId)
        {
            var list = (from c in Context.GroupPermissions
                where c.GroupId == groupId && c.Value == true
                select c.PermissionCode).ToList();

            return list;
        }

        public DtoGroupPermissions SelectById(int id, string lang)
        {
            DtoGroupPermissions list;
            if (lang == "en")
            {
                list = (from q in Context.GroupPermissions
                        where q.Id == id
                        select new DtoGroupPermissions
                        {
                            GroupId = q.GroupId,
                            PermissionCode = q.PermissionCode,
                            Value = q.Value,
                        }).FirstOrDefault();
            }
            else
            {
                list = (from q in Context.GroupPermissions
                        where q.Id == id
                        select new DtoGroupPermissions
                        {
                            GroupId = q.GroupId,
                            PermissionCode = q.PermissionCode,
                            Value = q.Value,
                        }).FirstOrDefault();
            } return list;
        }

    }
}

