namespace LirikWatch.Common.Records.VideoRecords
{
    public class Games
    {
        public string Id { get; init; }
        public string Title { get; init; }
        public string BoxArtUrl { get; init; }
    }

    public class GamesMeta
    {
        public int DurationMilliseconds { get; init; }
        public int PositionMilliseconds { get; init; }
        public string Id { get; init; }
        public string Title { get; init; }
        public string BoxArtUrl { get; init; }
    }
}