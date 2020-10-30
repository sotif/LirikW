using System;

namespace LirikWatch.Common.Records.VideoRecords
{
    public class Video
    {
        public string Title { get; init; }
        
        public ulong BroadcastId { get; init; }

        public string Url { get; init; }

        public DateTime CreatedAt { get; init; }

        public string Id { get; init; }

        public int LengthInSeconds { get; init; }
    }
}