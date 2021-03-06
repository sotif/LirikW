using Microsoft.Extensions.DependencyInjection;

namespace LirikWatch.Yt
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddYtServices(this IServiceCollection services)
        {
            services.AddSingleton<IYtService, YtService>();
            
            return services;
        }
    }
}