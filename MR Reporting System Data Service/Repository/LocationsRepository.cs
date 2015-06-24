
using DatabaseContext.MedicalContext;
using DataService.Repository;
using Interface.IDataService;
using Model.DTOModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;



namespace DataServices.Repository
{
    public class LocationsRepository : GenericRepository<MedicalContext, Location>, ILocationsRepository
    {
        public List<DtoLocations> selectAll(string lang)
        {
            var list = new List<DtoLocations>();
            if (lang == "en")
            {
                list = (from q in Context.Locations
                        select new DtoLocations
                        {
                            title = q.title
                        }).ToList();
            }
            else
            {
                list = (from q in Context.Locations
                        select new DtoLocations
                        {
                            title = q.title
                        }).ToList();
            } return list;
        }

        //WriteMethode4

        public DtoLocations selectById(int id, string lang)
        {
            var list = new DtoLocations();
            if (lang == "en")
            {
                list = (from q in Context.Locations
                        where q.id == id
                        select new DtoLocations
                        {
                            title = q.title
                        }).FirstOrDefault();
            }
            else
            {
                list = (from q in Context.Locations
                        where q.id == id
                        select new DtoLocations
                        {
                            title = q.title
                        }).FirstOrDefault();
            } return list;
        }

    }
}

