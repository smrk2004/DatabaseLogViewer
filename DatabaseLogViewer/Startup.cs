using AutoMapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using Serilog.Events;
using Swashbuckle.AspNetCore.Swagger;

using DatabaseLogViewer.Interfaces;
using DatabaseLogViewer.Services;
using DatabaseLogViewer.Repositories;

namespace DatabaseLogViewer
{
	public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;

			//Logging
			Log.Logger = new LoggerConfiguration()
			  .MinimumLevel.Debug()
			  .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
			  .Enrich.FromLogContext()
			  .WriteTo.Console()
			  .WriteTo.RollingFile("logs\\DatabaseLogViewer-{Date}.txt")
			  .CreateLogger();
		}

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
		{
			//Repositories
			services.AddTransient<IDatabaseLogRepository, DatabaseLogRepository>();

			//Services
			services.AddTransient<IDatabaseLogService, DatabaseLogService>();

			services.AddMvc();
			services.AddAutoMapper();

			//Logging
			services.AddLogging(loggingBuilder =>
			  loggingBuilder.AddSerilog(dispose: true));

			//Swagger
			services.AddSwaggerGen(c => { c.SwaggerDoc("v1", new Info { Title = "DatabaseLogViewer", Version = "V1" }); });
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseBrowserLink();
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
			}

			// Enable middleware to serve generated Swagger as a JSON endpoint.
			app.UseSwagger();

			// Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.), specifying the Swagger JSON endpoint.
			app.UseSwaggerUI(c => { c.SwaggerEndpoint("/swagger/v1/swagger.json", "DatabaseLogViewer API V1"); });

			app.UseStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
