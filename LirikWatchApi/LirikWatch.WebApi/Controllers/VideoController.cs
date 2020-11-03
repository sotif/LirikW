using System.Linq;
using System.Threading.Tasks;
using LirikWatch.Common.Dtos.YtDtos;
using LirikWatch.Yt;
using Microsoft.AspNetCore.Mvc;

namespace LirikWatch.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VideoController : ControllerBase
    {
        private readonly IYtService _ytService;

        public VideoController(IYtService ytService)
        {
            _ytService = ytService;
        }

        [HttpGet("{vodId}")]
        public async Task<ActionResult<YtId>> GetYtId(string vodId)
        {
            var yt = await _ytService.GetYtComplete("UCpcmjxzCi4qcWT-bjvO8YTQ");
            if (!yt)
                return NotFound("Invalid vodId or couldn't find YouTube video");

            var item = yt.Some().FirstOrDefault(x => x.Snippet.Title.Contains(vodId));
            if (item == null)
                return NotFound("Invalid vodId or couldn't find YouTube video");

            return Ok(new YtId() {Id = item.Id.VideoId});
        }
    }
}