using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using LirikWatch.Common.Dtos.FilterDtos;
using LirikWatch.Common.Records.VideoRecords;
using LirikWatch.Services.Filter;
using Microsoft.AspNetCore.Mvc;

namespace LirikWatch.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilterController : ControllerBase
    {
        private readonly IFilterService _filterService;

        public FilterController(IFilterService filterService)
        {
            _filterService = filterService;
        }

        [HttpGet]
        public ActionResult<FilterDto> CompleteFilter([FromQuery] string search)
        {
            if (string.IsNullOrWhiteSpace(search))
                return BadRequest("Please specify a search query");
            
            var titleTask = _filterService.FilterVodsByTitle(search);
            var gameTask = _filterService.FilterGamesByTitle(search);
            Task<List<Video>> dateTask = Task.FromResult<List<Video>>(null);
            // This is universal datetime parsing using American style MM dd yyyy since Lirik does live in the US.
            // This will parse a number of different dates. Like 11.2.20, 11 2 20, 11-02-20 etc. Even without a specified year!
            if (DateTime.TryParse(search, CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal, out var date))
                dateTask = _filterService.FilterByDate(date);

            Task.WaitAll(titleTask, gameTask, dateTask);

            return Ok(new FilterDto()
            {
                FilterTitles = titleTask.Result,
                FilterGames = gameTask.Result,
                FilterDates = dateTask.Result
            });
        }

        [HttpGet("latest")]
        public async Task<ActionResult<List<VideoMetadata>>> GetLatestVods([FromQuery] int amount = 8)
        {
            if (amount < 1)
                return BadRequest("Amount must be greater than 0");

            var vods = await _filterService.LatestVods(amount);
            return Ok(vods);
        }

        [HttpGet("game")]
        public async Task<ActionResult<List<Video>>> GetVodsByGame([FromQuery] string gameId)
        {
            if (string.IsNullOrWhiteSpace(gameId))
                return BadRequest("Please specify a gameId");

            var vods = await _filterService.DeepFilterByGame(gameId);
            return Ok(vods);
        }
    }
}