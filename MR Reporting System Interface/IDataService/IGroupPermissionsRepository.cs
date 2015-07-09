using System.Collections.Generic;
using MR_Reporting_System_Data_Context.Context;
using MR_Reporting_System_Model.DataTransferObjectModel;

namespace MR_Reporting_System_Interface.IDataService
{
    public interface IGroupPermissionsRepository : IGenericRepository<GroupPermissions>
    {
        List<DtoGroupPermissions> SelectAll(int groupId, string lang);
        List<int?> PermissionWithNumbersByGroupIdArray(int groupId);
        DtoGroupPermissions SelectById(int id, string lang); 
    }
}

