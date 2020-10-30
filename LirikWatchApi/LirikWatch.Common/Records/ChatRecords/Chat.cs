using System.Collections.Generic;
using LirikWatch.Common.Records.VideoRecords;

namespace LirikWatch.Common.Records.ChatRecords
{
    public class Chat
    {
        public Video Video { get; init; }
        
        public List<Comment> Comments { get; init; }
    }
}