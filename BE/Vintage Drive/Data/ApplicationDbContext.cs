using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Vintage_Drive.Models.Entities;
namespace Vintage_Drive.Data
{
    public class ApplicationDbContext : IdentityDbContext<IdentityUser, IdentityRole, string>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Users> Users { get; set; }

        public DbSet<Orders> Orders { get; set; }

        public DbSet<Cars> Cars { get; set; }

        public DbSet<Shipments> Shipments { get; set; }

        public DbSet<Categories> Categories { get; set; }

        public DbSet<Payments> Payments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Orders <-> Payments (uno-a-uno)
            modelBuilder.Entity<Orders>()
                .HasOne(o => o.Payments)
                .WithOne(p => p.Orders)
                .HasForeignKey<Payments>(p => p.OrderId)
                .OnDelete(DeleteBehavior.Cascade); // ok, non crea ciclo

            // Users <-> Orders (uno-a-molti)
            modelBuilder.Entity<Orders>()
                .HasOne(o => o.Users)
                .WithMany(u => u.Orders)
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Orders <-> Shipments (uno-a-molti)
            modelBuilder.Entity<Orders>()
                .HasOne(o => o.Shipments)
                .WithMany()
                .HasForeignKey(o => o.ShipmentId)
                .OnDelete(DeleteBehavior.Restrict);

            // Cars <-> Orders (uno-a-molti)
            modelBuilder.Entity<Cars>()
                .HasOne(c => c.Orders)
                .WithMany(o => o.Cars)
                .HasForeignKey(c => c.OrderId)
                .OnDelete(DeleteBehavior.Restrict);

            // Cars <-> Shipments (uno-a-molti)
            modelBuilder.Entity<Cars>()
                .HasOne(c => c.Shipments)
                .WithMany(s => s.Cars)
                .HasForeignKey(c => c.ShipmentId)
                .OnDelete(DeleteBehavior.Restrict); // <--- essenziale

            // Cars <-> Categories (many-to-many)
            modelBuilder.Entity<Cars>()
                .HasMany(c => c.Categories)
                .WithMany(ca => ca.Cars);
        }





    }

}
