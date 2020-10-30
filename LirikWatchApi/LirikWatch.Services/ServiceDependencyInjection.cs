using LirikWatch.Services.Chat;
using Microsoft.Extensions.DependencyInjection;

namespace LirikWatch.Services
{
    public static class ServiceDependencyInjection
    {
        public static IServiceCollection AddCustomServices(this IServiceCollection services)
        {
            services.AddSingleton<IChatService, ChatServiceFile>();
            
            return services;
        }
    }
}