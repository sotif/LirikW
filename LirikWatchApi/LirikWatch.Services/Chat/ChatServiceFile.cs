﻿using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using ArgonautCore.Lw;
using LirikWatch.Common.Configurations;
using LirikWatch.Common.Records.ChatRecords;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace LirikWatch.Services.Chat
{
    public class ChatServiceFile : IChatService
    {
        private readonly ILogger<ChatServiceFile> _log;
        private readonly Dictionary<string, string> _fileDict;

        public ChatServiceFile(ILogger<ChatServiceFile> log, IOptions<FileConfigs> fileConfig)
        {
            _log = log;
            var files = Directory.GetFiles(fileConfig.Value.ChatLogs);
            _fileDict = files
                .ToDictionary(x => Path.GetFileNameWithoutExtension(x).Split('-')[1].TrimStart('v'), x => x);
        }


        public async Task<Option<List<Comment>>> GetChatBatch(int vodId, float startTimeOffset, float endTimeOffset)
        {
            _log.LogDebug($"Received chat batch request for {vodId.ToString()} from {startTimeOffset.ToString(CultureInfo.InvariantCulture)} - {endTimeOffset.ToString(CultureInfo.InvariantCulture)}");
            if (!_fileDict.TryGetValue(vodId.ToString(), out var path))
                return Option.None<List<Comment>>();

            string json = await File.ReadAllTextAsync(path);
            var chat = JsonConvert.DeserializeObject<Common.Records.ChatRecords.Chat>(json);
            var comments = chat.Comments
                .Where(x =>
                    x.ContentOffsetSeconds >= startTimeOffset && x.ContentOffsetSeconds <= endTimeOffset)
                .ToList();

            return comments.Count == 0 ? Option.None<List<Comment>>() : comments;
        }
    }
}