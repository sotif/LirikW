using LirikWatch.Services.Chat;
using LirikWatch.Services.Filter;
using Microsoft.Extensions.DependencyInjection;

namespace LirikWatch.Services
{
    public static class ServiceDependencyInjection
    {
        public static IServiceCollection AddCustomServices(this IServiceCollection services)
        {
            services.AddSingleton<IChatService, ChatServiceFile>();
            services.AddSingleton<IFilterService, FilterServiceFile>();
            
            return services;
        }
    }
}