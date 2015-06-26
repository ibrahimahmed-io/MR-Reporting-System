using System.Collections.Generic;
using System.Linq;
using MR_Reporting_System_Data_Context.Context;
using MR_Reporting_System_Interface.IDataService;
using MR_Reporting_System_Model.DataTransferObjectModel;

namespace MR_Reporting_System_Data_Service.Repository
{
    public class AreaRepository : GenericRepository<MedicalTechnoEntities, Area>, IAreaRepository
    {
        public List<DtoArea> SelectAll(string lang)
        {
            List<DtoArea> list;
            if (lang == "en")
            {
                list = (from q in Context.Areas
                        select new DtoArea
                        {

                            Id=q.Id,
                            LocationId = q.LocationId,
                            Title = q.Title,
                            DeletedBy = q.DeletedBy,
                        }).ToList();
            }
            else
            {
                list = (from q in Context.Areas
                        select new DtoArea
                        {
                            Id = q.Id,
                            LocationId = q.LocationId,
                            Title = q.Title,
                            DeletedBy = q.DeletedBy,
                        }).ToList();
            } return list;
        }

        //WriteMethode4

        public DtoArea SelectById(int id, string lang)
        {
            DtoArea list;
            if (lang == "en")
            {
                list = (from q in Context.Areas
                        where q.Id == id
                        select new DtoArea
                        {
                            LocationId = q.LocationId,
                            Title = q.Title,
                            DeletedBy = q.DeletedBy,
                        }).FirstOrDefault();
            }
            else
            {
                list = (from q in Context.Areas
                        where q.Id == id
                        select new DtoArea
                        {
                            LocationId = q.LocationId,
                            Title = q.Title,
                            DeletedBy = q.DeletedBy,
                        }).FirstOrDefault();
            } return list;
        }

    }
}

