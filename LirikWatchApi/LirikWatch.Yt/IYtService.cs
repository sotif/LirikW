using System.Collections.Generic;
using System.Threading.Tasks;
using ArgonautCore.Lw;
using LirikWatch.Common.Dtos.YtDtos;

namespace LirikWatch.Yt
{
    //https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=UCpcmjxzCi4qcWT-bjvO8YTQ&maxResults=5&pageToken=CAUQAA&type=video&key=[YOUR_API_KEY]'

    public interface IYtService
    {
        public Task<Result<YtResponse, Error>> GetRawYtResponse(string channelId, int maxResults, string pageToken);
        public Task<Result<List<Item>, Error>> GetYtComplete(string channelId);
    }
}