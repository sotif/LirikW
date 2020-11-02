using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using LirikWatch.Common.Records.VideoRecords;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace LirikWatch.Services.Filter
{
    public class FilterServiceFile : IFilterService
    {
        private readonly ILogger<FilterServiceFile> _log;
        private readonly List<VideoMetadata> _metaData = new List<VideoMetadata>();
        private readonly List<Games> _games = new List<Games>();

        public FilterServiceFile(ILogger<FilterServiceFile> log)
        {
            _log = log;
            var metaData = Directory.GetFiles("F:/Coding/LirikWatch/ExampleData/TestData/MetaData");
            this.LoadAllMetadataIntoMemory(metaData);
        }

        private void LoadAllMetadataIntoMemory(string[] files)
        {
            _log.LogInformation("Loading all metadata into memory for quick searching");
            foreach (var file in files)
            {
                var json = File.ReadAllText(file);
                var data = JsonConvert.DeserializeObject<VideoMetadata>(json);
                _metaData.Add(data);
                foreach (var game in data.Games)
                {
                    if (_games.Any(x => x.Id == game.Id))
                        continue;
                    
                    _games.Add(new Games()
                    {
                        Id = game.Id,
                        Title = game.Title,
                        BoxArtUrl = game.BoxArtUrl
                    });
                }
            }            
        }

        public Task<List<Games>> FilterGames(string search)
        {
            var filtered = this._games
                .Where(x => x.Title.Contains(search, StringComparison.InvariantCultureIgnoreCase))
                .ToList();
            return Task.FromResult(filtered);
        }

        public Task<List<Video>> FilterVods(string search)
        {
            var filtered = this._metaData
                .Where(x => x.Video.Title.Contains(search, StringComparison.InvariantCultureIgnoreCase))
                .Select(x=> x.Video)
                .ToList();

            return Task.FromResult(filtered);
        }

        public Task<List<Video>> FilterByDate(DateTime date)
        {
            var vods = this._metaData
                .Where(x => x.Video.CreatedAt.Date.Equals(date.Date))
                .Select(x => x.Video)
                .ToList();

            return Task.FromResult(vods);
        }

        public Task<List<Video>> LatestVods(int amount)
        {
            var vods = this._metaData
                .OrderByDescending(x => x.Video.CreatedAt)
                .Take(amount)
                .Select(x=> x.Video)
                .ToList();

            return Task.FromResult(vods);
        }
    }
}