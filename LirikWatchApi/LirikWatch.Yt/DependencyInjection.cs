using LirikWatch.Common.Configurations;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace LirikWatch.Yt
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddYtServices(this IServiceCollection services)
        {
            return services;
        }
    }
}