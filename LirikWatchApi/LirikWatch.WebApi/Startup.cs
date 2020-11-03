using System;
using System.IO;
using System.Net;
using System.Reflection;
using System.Text;
using LirikWatch.Common.Configurations;
using LirikWatch.Services;
using LirikWatch.Services.Chat;
using LirikWatch.Services.Filter;
using LirikWatch.WebApi.Helpers;
using LirikWatch.Yt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

namespace LirikWatch.WebApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private readonly IConfiguration _configuration;
        
        public void ConfigureDevelopmentServices(IServiceCollection services)
        {
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo()
                {
                    Title = "Lirik Watch API",
                    Version = "v1",
                    Description = "API for LirikW Website"
                });
                
                // Set the comments path for the Swagger JSON and UI.
                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                c.IncludeXmlComments(xmlPath);
                
            });
            
            ConfigureServices(services);
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers().AddNewtonsoftJson(op =>
            {
                op.UseCamelCasing(false);
            });
            services.AddRouting(op => op.LowercaseUrls = true);

            services.AddCors();

            services.AddConfigurations(_configuration);

            services.AddCustomServices();
            services.AddYtServices();
        }
        
        private bool LifetimeValidator(DateTime? notbefore, DateTime? expires, SecurityToken securitytoken, TokenValidationParameters validationparameters)
        {
            return notbefore <= DateTime.UtcNow && expires >= DateTime.UtcNow;
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // Warm up all the services that need it
            app.ApplicationServices.GetRequiredService<IChatService>();
            app.ApplicationServices.GetRequiredService<IFilterService>();
            
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                
                // Enable middleware to serve generated swagger as a json endpoint
                app.UseSwagger();
                // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
                // specifying the Swagger JSON endpoint.
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "CDN.NET");
                });
            }
            else
            {
                // Global exception handling
                app.UseExceptionHandler(builder =>
                {
                    builder.Run(async context =>
                    {
                        context.Response.StatusCode = (int) HttpStatusCode.InternalServerError;

                        var error = context.Features.Get<IExceptionHandlerFeature>();
                        if (error != null)
                        {
                            context.Response.AddApplicationError(error.Error.Message);
                            await context.Response.WriteAsync(error.Error.Message);
                        }
                    });
                });
            }

            app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            
            app.UseRouting();

            // Add support for static files. Ordering is important
            app.UseDefaultFiles(); // search index.html in wwwroot
            app.UseStaticFiles();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapFallbackToController("Index", "Fallback"); // Use our fallback
            });
        }
    }
}
