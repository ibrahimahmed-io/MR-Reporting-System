using System.Collections.Generic;
using MR_Reporting_System_Data_Context.Context;
using MR_Reporting_System_Model.DataTransferObjectModel;
using System;

namespace MR_Reporting_System_Interface.IDataService
{
    public interface IVisitsRepository:IGenericRepository<Visit>
    {
        List<DtoVisits> SelectAll( string lang);
        DtoVisits SelectById(int id, string lang);

        List<DtoVisitCost> visitsCostByAgent(int? AgentId, DateTime? stratDate, DateTime? finishDate);
        List<DtoVisits> visitsByAgent(int? AgentId, DateTime? stratDate, DateTime? finishDate);
        List<DtoSummaryWords> alertsCount();
        List<DtoVisits> alertsCountDetail(string listType);

        List<DtoVisits> visitsByArea(int? AreaId, DateTime? stratDate, DateTime? finishDate);

        DtoVisitCountForDrugReport SelectVisitsForDrugReport(int drugId);

        DtoMorningLateVisitCountForDrugReport SelectVisitsMorningCountForDrugReport(int drugId);
    }
}

