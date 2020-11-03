using System.Collections.Generic;

namespace LirikWatch.Common.Records.VideoRecords
{
    public class VideoMetadata
    {
        public Video Video { get; set; }
        public List<GamesMeta> Games { get; set; }
    }
}