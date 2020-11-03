using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using LirikWatch.Common.Configurations;
using LirikWatch.Common.Dtos.YtDtos;
using LirikWatch.Common.Records.VideoRecords;
using LirikWatch.Yt;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace LirikWatch.Services.Filter
{
    public class FilterServiceFile : IFilterService
    {
        private readonly ILogger<FilterServiceFile> _log;
        private readonly List<VideoMetadata> _metaData = new List<VideoMetadata>();
        private readonly List<Games> _games = new List<Games>();
        
        private readonly IYtService _ytService;
        private List<Item> _ytCache;
        private DateTime _lastCacheRefresh = DateTime.UtcNow;

        private const int _YT_TTL_MINS = 30;

        public FilterServiceFile(ILogger<FilterServiceFile> log, IYtService ytService, IOptions<FileConfigs> fileConfig)
        {
            _log = log;
            _ytService = ytService;
            var metaData = Directory.GetFiles(fileConfig.Value.Metadata);
            this.LoadAllMetadataIntoMemory(metaData);
        }

        private async Task<bool> CheckVodOnYt(string vodId)
        {
            // Check if we have to make a request
            if (_ytCache == null || DateTime.UtcNow.Subtract(_lastCacheRefresh).TotalMinutes > _YT_TTL_MINS)
            {
                var yt = await _ytService.GetYtComplete("UCpcmjxzCi4qcWT-bjvO8YTQ");
                if (!yt) return false;

                _ytCache = yt.Some();
            }

            return _ytCache.Any(x => x.Snippet.Title.Contains(vodId));
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

        private string GetYoutubeId(string vodId)
        {
            return _ytCache.First(x => x.Snippet.Title.Contains(vodId)).Id.VideoId;
        }

        public Task<List<Games>> FilterGamesByTitle(string search)
        {
            var filtered = this._games
                .Where(x => x.Title.Contains(search, StringComparison.InvariantCultureIgnoreCase))
                .ToList();
            return Task.FromResult(filtered);
        }

        public Task<List<Video>> FilterVodsByTitle(string search)
        {
            var filtered = this._metaData
                .Where(x => x.Video.Title.Contains(search, StringComparison.InvariantCultureIgnoreCase) && this.CheckVodOnYt(x.Video.Id.TrimStart('v')).Result)
                .Select(x =>
                {
                    var v = x.Video;
                    v.YtId = this.GetYoutubeId(v.Id.TrimStart('v'));
                    return v;
                })
                .ToList();

            return Task.FromResult(filtered);
        }

        public Task<List<Video>> FilterByDate(DateTime date)
        {
            var vods = this._metaData
                .Where(x => x.Video.CreatedAt.Date.Equals(date.Date) && this.CheckVodOnYt(x.Video.Id.TrimStart('v')).Result)
                .Select(x => {
                    var v = x.Video;
                    v.YtId = this.GetYoutubeId(v.Id.TrimStart('v'));
                    return v;
                })
                .ToList();

            return Task.FromResult(vods);
        }

        public Task<List<Video>> LatestVods(int amount)
        {
            var vods = this._metaData
                .Where(x=> this.CheckVodOnYt(x.Video.Id.TrimStart('v')).Result)
                .OrderByDescending(x => x.Video.CreatedAt)
                .Take(amount)
                .Select(x=> {
                    var v = x.Video;
                    v.YtId = this.GetYoutubeId(v.Id.TrimStart('v'));
                    return v;
                })
                .ToList();

            return Task.FromResult(vods);
        }

        public Task<List<Video>> DeepFilterByGame(string gameId)
        {
            var vods = this._metaData
                .Where(x => x.Games.Any(y => y.Id == gameId) && this.CheckVodOnYt(x.Video.Id.TrimStart('v')).Result)
                .OrderByDescending(x => x.Video.CreatedAt)
                .Select(x => {
                    var v = x.Video;
                    v.YtId = this.GetYoutubeId(v.Id.TrimStart('v'));
                    return v;
                })
                .ToList();

            return Task.FromResult(vods);
        }
    }
}