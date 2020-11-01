using System.Collections.Generic;
using System.Threading.Tasks;
using LirikWatch.Common.Records.ChatRecords;
using LirikWatch.Services.Chat;
using Microsoft.AspNetCore.Mvc;

namespace LirikWatch.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;

        public ChatController(IChatService chatService)
        {
            _chatService = chatService;
        }

        [HttpGet("{vodId}")]
        public async Task<ActionResult<List<Comment>>> GetChatBatch(int vodId, float startTime, float endTime)
        {
            var chat = await _chatService.GetChatBatch(vodId, startTime, endTime);
            if (!chat)
                return NotFound("VodId or chat offset invalid");

            return chat.Some();
        }
    }
}