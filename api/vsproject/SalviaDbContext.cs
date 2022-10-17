using Microsoft.EntityFrameworkCore;

namespace SalviaServiceAPI 
{
    /// <summary>
    /// DbContext-class to handle everything database-related
    /// </summary>
    public class SalviaDbContext : DbContext
    {
        public SalviaDbContext(DbContextOptions<SalviaDbContext> options) : base(options)
        {
            
        }

        public DbSet<TestCase> TestCase { get; set; }
        public DbSet<TestRun> TestRun { get; set; }
    }
}

