using System;
using System.IO;
using System.Net;
using System.Reflection;
using System.Text;
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
                
                // c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
                // {
                //     Description = "Used for JWT token",
                //     Name = "Authorization",
                //     In = ParameterLocation.Header,
                //     Type = SecuritySchemeType.ApiKey,
                //     Scheme = "Bearer"
                // });
                //
                // c.AddSecurityRequirement(new OpenApiSecurityRequirement()
                // {
                //     {
                //         new OpenApiSecurityScheme()
                //         {
                //             Reference = new OpenApiReference()
                //             {
                //                 Type = ReferenceType.SecurityScheme,
                //                 Id = "Bearer"
                //             },
                //             Scheme = "oauth2",
                //             Name = "Bearer",
                //             In = ParameterLocation.Header
                //         }, 
                //         new List<string>()
                //     }
                // });
                
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

            services.AddAuthentication() //JwtBearerDefaults.AuthenticationScheme
                .AddJwtBearer("Bearer", options =>
                {
                    options.SaveToken = true;
                    options.TokenValidationParameters = new TokenValidationParameters()
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.ASCII.GetBytes("123132123")), //TODO JWT KEY
                        ValidateIssuer = true,
                        //Usually, this is your application base URL
                        ValidIssuer = "http://localhost:5000/", // TODO constant token issuer
                        ValidateAudience = false,
                        //Here, we are creating and using JWT within the same application.
                        //In this case, base URL is fine.
                        //If the JWT is created using a web service, then this would be the consumer URL.
                        // WE CANNOT USE THIS 
                        // we use this as an API that you can call via any other machines and processes. 
                        // ValidAudience = "http://localhost:5000/", 
                        RequireExpirationTime =
                            false, // So we can generate permanent tokens for easier API management
                        ValidateLifetime =
                            true, // We still want to validate the frontend tokens tho since those are time bound.
                        LifetimeValidator = LifetimeValidator
                    };
                });
            
            services.AddAuthorization(op =>
            {
                op.DefaultPolicy = new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .AddAuthenticationSchemes("Bearer").Build();
            });

            services.AddCors();

            services.AddConfigurations(_configuration);

            services.AddCustomServices();
            services.AddYtServices(_configuration);
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

            app.UseAuthorization();
            app.UseAuthentication();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
