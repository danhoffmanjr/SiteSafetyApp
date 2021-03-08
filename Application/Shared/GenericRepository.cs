using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PikeSafetyWebApp.Application.Errors;
using PikeSafetyWebApp.Application.Interfaces;
using PikeSafetyWebApp.Data;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.Shared
{
    public class GenericRepository<TEntity> : IGenericRepository<TEntity> where TEntity : EntityBase
    {
        internal readonly PikeSafetyDbContext context;
        internal DbSet<TEntity> entities;
        public GenericRepository(PikeSafetyDbContext context)
        {
            this.context = context;
            entities = context.Set<TEntity>();
        }

        public async Task<IEnumerable<TEntity>> ListAllAsync()
        {
            return await entities.AsNoTracking().ToListAsync();
        }

        public async Task<IEnumerable<TEntity>> ListAllIncludingAsync(params Expression<Func<TEntity, object>>[] includesProperties)
        {
            return await Task.FromResult(GetAllIncluding(includesProperties));
        }

        public async Task<IEnumerable<TEntity>> FindByAsync(Expression<Func<TEntity, bool>> predicate)
        {
            IEnumerable<TEntity> results = await entities.AsNoTracking().Where(predicate).ToListAsync();
            return results;
        }

        public async Task<TEntity> FindByKeyAsync(long id)
        {
            return await entities.AsNoTracking().SingleOrDefaultAsync(key => key.Id == id);
        }

        public async Task<IEnumerable<TEntity>> FindByIncludingAsync(Expression<Func<TEntity, bool>> predicate, params Expression<Func<TEntity, object>>[] includesProperties)
        {
            var query = GetAllIncluding(includesProperties);
            IEnumerable<TEntity> results = await query.Where(predicate).ToListAsync();
            return results;
        }
        public async Task<TEntity> FindByConditionAsync(Expression<Func<TEntity, bool>> predicate) => await entities.FirstOrDefaultAsync(predicate);

        public async Task<bool> AddAsync(TEntity entity)
        {
            if (entity == null) throw new ArgumentNullException("entity");

            await entities.AddAsync(entity);

            bool succeeded = await context.SaveChangesAsync() > 0;
            if (!succeeded) throw new RestException(HttpStatusCode.BadRequest, new { Save = $"Problem adding {nameof(TEntity)}." });
            return succeeded;
        }

        public void Add(TEntity entity)
        {
            entities.Add(entity);
        }

        public async Task<bool> UpdateAsync(TEntity entity)
        {
            if (entity == null) throw new ArgumentNullException("entity");

            bool succeeded = await context.SaveChangesAsync() > 0;
            if (!succeeded) throw new RestException(HttpStatusCode.BadRequest, new { Update = $"Problem updating {nameof(TEntity)}." });
            return succeeded;
        }

        public void Update(TEntity entity)
        {
            entities.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
        }

        public async Task<bool> DeleteAsync(long id)
        {
            if (id == 0) throw new ArgumentNullException("entity");

            TEntity entity = await entities.SingleOrDefaultAsync(e => e.Id == id);
            if (entity == null) throw new RestException(HttpStatusCode.NotFound, new { Delete = $"{nameof(TEntity)} not found for deletion." });
            entities.Remove(entity);

            bool succeeded = await context.SaveChangesAsync() > 0;
            if (!succeeded) throw new RestException(HttpStatusCode.BadRequest, new { Delete = $"Problem deleting {nameof(TEntity)}." });
            return succeeded;
        }

        private IQueryable<TEntity> GetAllIncluding(params Expression<Func<TEntity, object>>[] includeProperties)
        {
            IQueryable<TEntity> queryable = entities.AsNoTracking();

            return includeProperties.Aggregate(queryable, (current, property) => current.Include(property));
        }
    }
}