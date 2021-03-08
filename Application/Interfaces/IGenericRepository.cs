using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using PikeSafetyWebApp.Models.Interfaces;

namespace PikeSafetyWebApp.Application.Interfaces
{
    public interface IGenericRepository<TEntity> where TEntity : IEntityBase
    {
        Task<IEnumerable<TEntity>> ListAllAsync();
        Task<IEnumerable<TEntity>> ListAllIncludingAsync(params Expression<Func<TEntity, object>>[] includesProperties);
        Task<IEnumerable<TEntity>> FindByAsync(Expression<Func<TEntity, bool>> predicate);
        Task<TEntity> FindByKeyAsync(long id);
        Task<IEnumerable<TEntity>> FindByIncludingAsync(Expression<Func<TEntity, bool>> predicate, params Expression<Func<TEntity, object>>[] includesProperties);
        Task<TEntity> FindByConditionAsync(Expression<Func<TEntity, bool>> predicate);
        Task<bool> AddAsync(TEntity entity);
        void Add(TEntity entity);
        Task<bool> UpdateAsync(TEntity entity);
        void Update(TEntity entity);
        Task<bool> DeleteAsync(long id);
    }
}