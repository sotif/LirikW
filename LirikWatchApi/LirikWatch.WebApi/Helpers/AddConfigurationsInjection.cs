using LirikWatch.Common.Configurations;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace LirikWatch.WebApi.Helpers
{
    public static class AddConfigurationsInjection
    {
        public static IServiceCollection AddConfigurations(this IServiceCollection services,
            IConfiguration configuration)
        {
            services.Configure<YtApiConfig>(configuration.GetSection("YtApi"));
            services.Configure<FileConfigs>(configuration.GetSection("FileLocations"));

            return services;
        }
    }
}