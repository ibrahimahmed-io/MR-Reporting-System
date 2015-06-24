using System.Collections.Generic;
using System.Linq;
using MR_Reporting_System_Data_Context.Context;
using MR_Reporting_System_Interface.IDataService;
using MR_Reporting_System_Model.DataTransferObjectModel;

namespace MR_Reporting_System_Data_Service.Repository
{
    public class DefaultListRepository : GenericRepository<MedicalTechnoEntities, DefaultList>, IDefaultListRepository
    {
        public List<DtoDefaultList> SelectAll(string lang)
        {
            List<DtoDefaultList> list;
            if (lang == "en")
            {
                list = (from q in Context.DefaultLists
                        select new DtoDefaultList
                        {
                            Title = q.Title,
                            Type = q.Type,
                            Action = q.Action,
                        }).ToList();
            }
            else
            {
                list = (from q in Context.DefaultLists
                        select new DtoDefaultList
                        {
                            Title = q.Title,
                            Type = q.Type,
                            Action = q.Action,
                        }).ToList();
            } return list;
        }

        public DtoDefaultList SelectById(int id, string lang)
        {
            DtoDefaultList list;
            if (lang == "en")
            {
                list = (from q in Context.DefaultLists
                        where q.Id == id
                        select new DtoDefaultList
                        {
                            Title = q.Title,
                            Type = q.Type,
                            Action = q.Action,
                        }).FirstOrDefault();
            }
            else
            {
                list = (from q in Context.DefaultLists
                        where q.Id == id
                        select new DtoDefaultList
                        {
                            Title = q.Title,
                            Type = q.Type,
                            Action = q.Action,
                        }).FirstOrDefault();
            } return list;
        }
        public IEnumerable<DefaultList> SelectByAccountIdType(int accountOwnerId, string listType)
        {
            var list = (from q in Context.DefaultLists
                where q.Type == listType
                select q).
                ToList();
            return list.AsEnumerable();
        }

        public IEnumerable<DefaultList> SelectByAccountIdTypeAbbreviation(string abbreviation,
            int accountOwnerId, string listType)
        {
            var list = (from q in Context.DefaultLists
                where q.Type == listType
                select q).
                ToList();
            return list.AsEnumerable();
        }

        public IEnumerable<DefaultList> SelectByAccountIdTypeAction(string listType, int action,
            int accountOwnerId)
        {
            var list = (from q in Context.DefaultLists
                where q.Type == listType && q.Action == action
                select q).
                ToList();
            return list.AsEnumerable();
        }

        public DefaultList SelectByAccountIdTypeActionNotList(string listType, int action, int accountOwnerId)
        {
            var list = (from q in Context.DefaultLists
                        where q.Type == listType && q.Action == action
                        select q).
                FirstOrDefault();
            return list;
        }

        public IEnumerable<DefaultList> SelectByAccountIdTypeNoAction(string listType, int accountId)
        {
            var list = (from q in Context.DefaultLists
                where  q.Type == listType
                select q).
                ToList();
            return list.AsEnumerable();
        }

        public DefaultList SelectById(int id)
        {
            var result = (from q in Context.DefaultLists
                          where q.Id == id
                          select q).FirstOrDefault();
            return result;
        }

        public IEnumerable<DtoDefaultList> SelectTypes(string lang)
        {
            var list = (from q in Context.DefaultLists
                        select new DtoDefaultList
                        {
                            Id = q.Id,
                            Title = q.Title,
                          
                        }).Distinct().ToList();

            return list;
        }

        public IEnumerable<DtoDefaultList> SelectTypesNotEqualAction(string listType, int action, string lang)
        {
            var list = (from q in Context.DefaultLists
                        where q.Type == listType && q.Action != action
                        select new DtoDefaultList
                        {
                            Id = q.Id,
                            Title =  q.Title  
                        }).Distinct();

            return list.AsEnumerable();
        }

        public List<DtoDefaultList> SelectByListType(string listType, int accountOwnerId, string language)
        {
            var list = (from q in Context.DefaultLists
                        where q.Type == listType  
                        select new DtoDefaultList
                        {
                            Id = q.Id,
                            Action = q.Action,
                            Title =  q.Title  
                        }).ToList();

            return list;
        }

        public DtoDefaultList SelectForEdit(int id)
        {
            var list = (from q in Context.DefaultLists
                        where q.Id == id
                        select new DtoDefaultList
                        {
                            Id = q.Id,
                            Title = q.Title,

                            Action = q.Action
                        }).FirstOrDefault();

            return list;
        }

        public IEnumerable<DtoDefaultList> SelectByListTypeWithAction(string listType, string lang)
        {

            var list = new List<DtoDefaultList>();

            if (lang == "en")
            {
                list = (from q in Context.DefaultLists
                        where q.Type == listType && q.Action != 0
                        select new DtoDefaultList
                        {
                            Id = q.Id,
                            Title = q.Title,
                            Action = q.Action
                        }).ToList();
            }
            else if (lang == "ar")
            {
                list = (from q in Context.DefaultLists
                        where q.Type == listType && q.Action != 0
                        select new DtoDefaultList
                        {
                            Id = q.Id,
                            Title = q.Title,
                            Action = q.Action
                        }).ToList();
            }

            return list.AsEnumerable();
        }
    }
}

