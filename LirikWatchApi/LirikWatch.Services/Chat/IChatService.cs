using System.Collections.Generic;
using System.Threading.Tasks;
using ArgonautCore.Lw;
using LirikWatch.Common.Records.ChatRecords;

namespace LirikWatch.Services.Chat
{
    public interface IChatService
    {
        public Task<Option<List<Comment>>> GetChatBatch(int vodId, float startTimeOffset, float endTimeOffset);
    }
}