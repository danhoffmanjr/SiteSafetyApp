using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Data
{
    public class PikeSafetyDbContext : IdentityDbContext<AppUser, AppRole, string, IdentityUserClaim<string>, AppUserRole, IdentityUserLogin<string>, IdentityRoleClaim<string>, IdentityUserToken<string>>
    {
        public PikeSafetyDbContext(DbContextOptions options) : base(options)
        {
        }

        public virtual DbSet<ActiveStorageAttachments> ActiveStorageAttachments { get; set; }
        public virtual DbSet<ActiveStorageBlobs> ActiveStorageBlobs { get; set; }
        public virtual DbSet<Company> Companies { get; set; }
        public virtual DbSet<ReportType> ReportTypes { get; set; }
        public virtual DbSet<Report> Reports { get; set; }
        public virtual DbSet<ReportImage> ReportImages { get; set; }
        public virtual DbSet<Site> Sites { get; set; }
        public virtual DbSet<UserSite> UserSites { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<AppUser>(b =>
            {
                // Each User can have many entries in the UserRole join table
                b.HasMany(e => e.UserRoles)
                    .WithOne(e => e.User)
                    .HasForeignKey(ur => ur.UserId)
                    .IsRequired();
            });

            modelBuilder.Entity<AppRole>(b =>
            {
                // Each Role can have many entries in the UserRole join table
                b.HasMany(e => e.UserRoles)
                    .WithOne(e => e.Role)
                    .HasForeignKey(ur => ur.RoleId)
                    .IsRequired();
            });

            modelBuilder.Entity<UserSite>()
            .HasKey(t => new { t.AppUserId, t.SiteId });

            modelBuilder.Entity<AppUser>(b =>
            {
                // Each User can have many entries in the UserSite join table
                b.HasMany(e => e.UserSites)
                    .WithOne(e => e.User)
                    .HasForeignKey(ur => ur.AppUserId)
                    .IsRequired();
            });

            modelBuilder.Entity<Site>(b =>
            {
                // Each Site can have many entries in the UserSite join table
                b.HasMany(e => e.UserSites)
                    .WithOne(e => e.Site)
                    .HasForeignKey(ur => ur.SiteId)
                    .IsRequired();
            });
        }
    }
}