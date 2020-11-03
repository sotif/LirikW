using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using ArgonautCore.Lw;
using ArgonautCore.Network.Http;
using LirikWatch.Common.Configurations;
using LirikWatch.Common.Dtos.YtDtos;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace LirikWatch.Yt
{
    //https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=UCpcmjxzCi4qcWT-bjvO8YTQ&maxResults=5&pageToken=CAUQAA&type=video&key=[YOUR_API_KEY]'
    public class YtService : IYtService, IDisposable
    {
        private readonly ILogger<YtService> _log;
        private readonly string _apiToken;
        private readonly CoreHttpClient _http;

        public YtService(IOptions<YtApiConfig> config, ILogger<YtService> log)
        {
            _log = log;
            _apiToken = config.Value.ApiToken;
            
            var http = new HttpClient();
            http.DefaultRequestHeaders.Clear();
            http.DefaultRequestHeaders.Add("Accept", "application/json");

            _http = new CoreHttpClient(http);
        }

        public async Task<Result<YtResponse, Error>> GetRawYtResponse(string channelId, int maxResults, string pageToken)
        {
            if (string.IsNullOrWhiteSpace(channelId))
                return new Result<YtResponse, Error>(new Error("ChannelId cannot be empty or null"));

            var resp = await _http.GetAndMapResponse<YtResponse>(
                $"https://youtube.googleapis.com/youtube/v3/search?part=snippet" +
                $"&channelId={channelId}" +
                $"&maxResults={maxResults.ToString()}" +
                "&type=video" +
                $"&key={_apiToken}" +
                $"{(string.IsNullOrWhiteSpace(pageToken) ? "" : $"&pageToken={pageToken}")}");

            if (!resp)
            {
                _log.LogError($"Failed to fetch yt videos with params: {channelId} {maxResults.ToString()} {pageToken}\n{resp.Err().ToString()}");
                return resp;
            }

            return resp;
        }

        public async Task<Result<List<Item>, Error>> GetYtComplete(string channelId)
        {
            List<Item> items = new List<Item>();
            string pageToken = null;
            do
            {
                var resp = await this.GetRawYtResponse(channelId, 50, pageToken);
                if (!resp)
                {
                    _log.LogError($"Failed to recursively fetch yt videos for: {channelId} page: {pageToken}\n{resp.Err().ToString()}");
                    if (items.Count == 0)
                        return new Result<List<Item>, Error>(resp.Err());
                    break;
                }

                var r = (~resp);
                var itemsToAppend = r.Items;
                items.AddRange(itemsToAppend);

                pageToken = r.NextPageToken;
            } while (!string.IsNullOrWhiteSpace(pageToken));
            
            return items;
        }

        public void Dispose()
        {
            _http?.Dispose();
        }
    }
}