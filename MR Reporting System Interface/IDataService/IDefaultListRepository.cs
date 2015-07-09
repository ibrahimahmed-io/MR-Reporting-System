using System.Collections.Generic;
using MR_Reporting_System_Data_Context.Context;
using MR_Reporting_System_Model.DataTransferObjectModel;

namespace MR_Reporting_System_Interface.IDataService
{
    public interface IDefaultListRepository:IGenericRepository<DefaultLists>
    {
        List<DtoDefaultList> SelectAll(string lang);
        DtoDefaultList SelectById(int id, string lang);
        IEnumerable<DefaultLists> SelectByAccountIdType(int accountOwnerId, string listType);
        IEnumerable<DefaultLists> SelectByAccountIdTypeAbbreviation(string listType, int accountOwnerId, string abbreviation);
        IEnumerable<DefaultLists> SelectByAccountIdTypeAction(string listType, int accountOwnerId, int action);
        IEnumerable<DefaultLists> SelectByAccountIdTypeNoAction(string listType, int accountOwnerId);
        DefaultLists SelectById(int id);
        DefaultLists SelectByAccountIdTypeActionNotList(string listType, int accountOwnerId, int action);
        IEnumerable<DtoDefaultList> SelectTypes(string lang);
        List<DtoDefaultList> SelectByListType(string listType, int accountOwnerId, string language);
        DtoDefaultList SelectForEdit(int id);
        IEnumerable<DtoDefaultList> SelectTypesNotEqualAction(string listType, int action, string lang);
        IEnumerable<DtoDefaultList> SelectByListTypeWithAction(string listType, string lang);
    }
}

