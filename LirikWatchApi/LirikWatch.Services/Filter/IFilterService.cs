using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using LirikWatch.Common.Records.VideoRecords;

namespace LirikWatch.Services.Filter
{
    public interface IFilterService
    {
        public Task<List<Games>> FilterGamesByTitle(string search);
        public Task<List<Video>> FilterVodsByTitle(string search);
        public Task<List<Video>> FilterByDate(DateTime date);
        public Task<List<Video>> LatestVods(int amount);

        public Task<List<Video>> DeepFilterByGame(string gameId);
    }
}