using System.Collections.Generic;
using MR_Reporting_System_Data_Context.Context;
using MR_Reporting_System_Model.DataTransferObjectModel;

namespace MR_Reporting_System_Interface.IDataService
{
    public interface IDefaultListRepository:IGenericRepository<DefaultList>
    {
        List<DtoDefaultList> SelectAll(string lang);
        DtoDefaultList SelectById(int id, string lang);
        IEnumerable<DefaultList> SelectByAccountIdType(int accountOwnerId, string listType);
        IEnumerable<DefaultList> SelectByAccountIdTypeAbbreviation(string listType, int accountOwnerId, string abbreviation);
        IEnumerable<DefaultList> SelectByAccountIdTypeAction(string listType, int accountOwnerId, int action);
        IEnumerable<DefaultList> SelectByAccountIdTypeNoAction(string listType, int accountOwnerId);
        DefaultList SelectById(int id);
        DefaultList SelectByAccountIdTypeActionNotList(string listType, int accountOwnerId, int action);
        IEnumerable<DtoDefaultList> SelectTypes(string lang);
        List<DtoDefaultList> SelectByListType(string listType, int accountOwnerId, string language);
        DtoDefaultList SelectForEdit(int id);
        IEnumerable<DtoDefaultList> SelectTypesNotEqualAction(string listType, int action, string lang);
        IEnumerable<DtoDefaultList> SelectByListTypeWithAction(string listType, string lang);
    }
}

