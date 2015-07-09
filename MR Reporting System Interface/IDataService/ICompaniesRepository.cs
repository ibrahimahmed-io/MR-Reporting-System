using System.Collections.Generic;
using MR_Reporting_System_Data_Context.Context;
using MR_Reporting_System_Model.DataTransferObjectModel;

namespace MR_Reporting_System_Interface.IDataService
{
    public interface ICompaniesRepository:IGenericRepository<Companies>
    {
        List<DtoCompanies> SelectAll( string lang);
        DtoCompanies SelectById(int id, string lang); 
    }
}

