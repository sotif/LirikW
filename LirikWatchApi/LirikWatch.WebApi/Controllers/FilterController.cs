﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using LirikWatch.Common.Records.VideoRecords;
using LirikWatch.Services.Filter;
using LirikWatch.WebApi.Dtos;
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
            
            var titleTask = _filterService.FilterVods(search);
            var gameTask = _filterService.FilterGames(search);
            Task<List<Video>> dateTask = Task.FromResult<List<Video>>(null);
            if (DateTime.TryParse(search, out var date))
                dateTask = _filterService.FilterByDate(date);

            Task.WaitAll(titleTask, gameTask, dateTask);

            return Ok(new FilterDto()
            {
                FilterTitles = titleTask.Result,
                FilterGames = gameTask.Result,
                FilterDates = dateTask.Result
            });
        }
    }
}