using DragoniteNET.Models;
using Microsoft.EntityFrameworkCore;

namespace DragoniteNET.DataContext
{
    public class DtaContext : DbContext
    {
        public DtaContext(DbContextOptions<DtaContext> options) : base(options) { }

        public DbSet<Users> User { get; set; }
        public DbSet<Mails> Mail { get; set; }
        public DbSet<Suggestions> Suggestion { get; set; }
    }
}
