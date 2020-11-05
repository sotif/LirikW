using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ArgonautCore.Lw;
using LirikWatch.Common.Records.VideoRecords;

namespace LirikWatch.Services.Filter
{
    public interface IFilterService
    {
        public Task<List<Games>> FilterGamesByTitle(string search);
        public Task<List<Video>> FilterVodsByTitle(string search);
        public Task<List<Video>> FilterByDate(DateTime date);
        public Task<List<VideoMetadata>> LatestVods(int amount);

        public Task<List<Video>> DeepFilterByGame(string gameId);

        public Task<Option<VideoMetadata>> GetVodMetadata(string vodId);
    }
}