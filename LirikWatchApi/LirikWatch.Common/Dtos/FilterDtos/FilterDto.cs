using System.Collections.Generic;
using LirikWatch.Common.Records.VideoRecords;

namespace LirikWatch.Common.Dtos.FilterDtos
{
    public class FilterDto
    {
        public List<Games> FilterGames { get; init; }
        public List<Video> FilterTitles { get; init; }
        public List<Video> FilterDates { get; init; }
    }
}