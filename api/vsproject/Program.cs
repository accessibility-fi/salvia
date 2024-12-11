using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using SalviaServiceAPI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


var builder = Host.CreateDefaultBuilder(args).ConfigureWebHostDefaults(webBuilder =>
{
	webBuilder.UseStartup<Startup>();
});

builder.ConfigureServices((ctx, services) => {

	var dbConnectionString = ctx.Configuration.GetSection("ConnectionStrings:AzureConnectionString");

	services.AddDbContext<SalviaDbContext>(opt => opt.UseSqlServer(dbConnectionString.Value));
	services.AddControllers();
	services.AddControllers().AddNewtonsoftJson();
});

builder.Build().Run();
