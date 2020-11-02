using System.Collections.Generic;
using ArgonautCore.Lw;
using LirikWatch.Common.Records.VideoRecords;

namespace LirikWatch.WebApi.Dtos
{
    public class FilterDto
    {
        public List<Games> FilterGames { get; init; }
        public List<Video> FilterTitles { get; init; }
        public List<Video> FilterDates { get; init; }
    }
}