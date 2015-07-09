using System.Collections.Generic;
using MR_Reporting_System_Data_Context.Context;
using MR_Reporting_System_Model.DataTransferObjectModel;

namespace MR_Reporting_System_Interface.IDataService
{
    public interface ILocationsRepository : IGenericRepository<Location>
    {
        List<DtoLocations> SelectAll(string lang);
        DtoLocations SelectById(int id, string lang);
    }
}

