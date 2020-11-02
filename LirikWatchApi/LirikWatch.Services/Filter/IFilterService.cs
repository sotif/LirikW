using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using LirikWatch.Common.Records.VideoRecords;

namespace LirikWatch.Services.Filter
{
    public interface IFilterService
    {
        public Task<List<Games>> FilterGames(string search);
        public Task<List<Video>> FilterVods(string search);
        public Task<List<Video>> FilterByDate(DateTime date);
    }
}