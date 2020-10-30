using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LirikWatch.WebApi.Helpers
{
    public static class Extensions
    {
        
        public static void AddApplicationError(this HttpResponse response, string message)
        {
            response.Headers.Add("Application-Error", message);
            response.Headers.Add("Access-Control-Expose-Headers", "Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin", "*");
        }

        public static int GetRequestUserId(this ControllerBase cb)
        {
            return int.Parse(cb.User.FindFirst(ClaimTypes.NameIdentifier).Value);
        }
    }
}