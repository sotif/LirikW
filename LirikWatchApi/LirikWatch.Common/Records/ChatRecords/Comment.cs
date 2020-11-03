using System;
using System.Collections.Generic;

namespace LirikWatch.Common.Records.ChatRecords
{
    public class Comment
    {
        public string Id { get; init; }

        public DateTime CreatedAt { get; init; }

        public float ContentOffsetSeconds { get; init; }

        public Commenter Commenter { get; init; }

        public MessageContent MessageContent { get; init; }
    }
    
    public class MessageContent
    {
        public string Body { get; init; }

        public List<Emote> Emotes { get; init; }

        public string UserColor { get; init; }
    }

    public class Emote
    {
        public string Id { get; init; }

        public int Begin { get; init; }

        public int End { get; init; }
    }

    public class Commenter
    {
        public string DisplayName { get; init; }
    }
}