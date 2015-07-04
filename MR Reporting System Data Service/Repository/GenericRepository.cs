using System;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using MR_Reporting_System_Interface.IDataService;

namespace MR_Reporting_System_Data_Service.Repository
{
    public abstract class GenericRepository<TC, T> : IGenericRepository<T>
        where T : class
        where TC : DbContext, new()
    {
        private TC _entities = new TC();

        public TC Context
        {
            get { return _entities; }
            set { _entities = value; }
        }

        public virtual IQueryable<T> GetAll()
        {
            IQueryable<T> query = _entities.Set<T>();
            return query;
        }

        public IQueryable<T> FindBy(Expression<Func<T, bool>> predicate)
        {
            var query = _entities.Set<T>().Where(predicate);
            return query;
        }

        public virtual void Add(T entity)
        {
            _entities.Set<T>().Add(entity);
        }

        public virtual void Delete(T entity)
        {
            _entities.Set<T>().Remove(entity);
        }

        public virtual void Edit(T entity)
        {
            _entities.Entry(entity).State = EntityState.Modified;
        }

        public virtual void Save()
        {
            try
            {
                _entities.SaveChanges();
            }
            catch (Exception e)
            {
                // ignored
            }
        }

        public virtual void Reload(T entity)
        {
            try
            {
                _entities.Entry(entity).GetDatabaseValues();
            }
            catch
            {
                // ignored
            }
        }
    }
}