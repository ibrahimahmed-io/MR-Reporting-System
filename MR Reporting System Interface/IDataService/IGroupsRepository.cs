using MR_Reporting_System_Data_Context.Context;
using System.Collections.Generic;
using MR_Reporting_System_Model.DataTransferObjectModel;

namespace MR_Reporting_System_Interface.IDataService
{
    public interface IGroupsRepository:IGenericRepository<Groups>
    {
        List<DtoGroups> SelectAll( string lang);
        DtoGroups SelectById(int id, string lang); 
    }
}

