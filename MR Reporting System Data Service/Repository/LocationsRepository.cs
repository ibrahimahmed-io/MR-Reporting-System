using System.Collections.Generic;
using System.Linq;
using MR_Reporting_System_Data_Context.Context;
using MR_Reporting_System_Interface.IDataService;
using MR_Reporting_System_Model.DataTransferObjectModel;

namespace MR_Reporting_System_Data_Service.Repository
{
    public class LocationsRepository : GenericRepository<MedicalTechnoEntities, Locations>, ILocationsRepository
    {
        public List<DtoLocations> SelectAll(string lang)
        {
            List<DtoLocations> list;

            if (lang == "en")
            {
                list = (from q in Context.Locations
                        select new DtoLocations
                        {
                            Title = q.Title
                        }).ToList();
            }
            else
            {
                list = (from q in Context.Locations
                        select new DtoLocations
                        {
                            Title = q.Title
                        }).ToList();
            } return list;
        }

        public DtoLocations SelectById(int id, string lang)
        {
            DtoLocations list;

            if (lang == "en")
            {
                list = (from q in Context.Locations
                        where q.Id == id
                        select new DtoLocations
                        {
                            Title = q.Title
                        }).FirstOrDefault();
            }
            else
            {
                list = (from q in Context.Locations
                        where q.Id == id
                        select new DtoLocations
                        {
                            Title = q.Title
                        }).FirstOrDefault();
            } return list;
        }

    }
}

