using System;
using System.Linq;
using System.Linq.Expressions;

namespace MR_Reporting_System_Interface.IDataService
{
 
        public interface IGenericRepository<T> where T : class
        {
            IQueryable<T> GetAll();
            IQueryable<T> FindBy(Expression<Func<T, bool>> predicate);
            void Add(T entity);
            void Delete(T entity);
            void Edit(T entity);
            void Save();
            void Reload(T entity);
        }
    
}
