using System.Collections.Generic;
using MR_Reporting_System_Data_Context.Context;
using MR_Reporting_System_Model.DataTransferObjectModel;

namespace MR_Reporting_System_Interface.IDataService
{
    public interface IHospitalsRepository : IGenericRepository<Hospital>
    {
        List<DtoHospitals> SelectAll(string lang);
        DtoHospitals SelectById(int id, string lang);
    }
}

