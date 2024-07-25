using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DragoniteNET.DataContext;
using DragoniteNET.Models;
using Microsoft.AspNetCore.Authorization;

namespace DragoniteNET.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SuggestionsController : ControllerBase
    {
        private readonly DtaContext _context;

        public SuggestionsController(DtaContext context)
        {
            _context = context;
        }

        // GET: api/Suggestions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Suggestions>>> GetSuggestion()
        {
            var getOriginSuggestion = await _context.Suggestion.OrderBy(a => a.Rating).Distinct().ToListAsync();
            List<Suggestions> res = new List<Suggestions>();

            foreach(var item in getOriginSuggestion)
            {
                if(item.Content.Length > 15)
                {
                    res.Add(new Suggestions
                    {
                        Id = item.Id,
                        Content = item.Content,
                        Rating = item.Rating,
                    });
                }
            }


            // loai bo nhung tu viet hoa ma ko phai nhung tu nằm ở đầu câu
            var result = res
                .Select(a => (a.Id, a.Rating, a.Content))
                .Distinct()
                .ToList();

            List<Suggestions> filterObj = result.Select(suggestion =>
            {
                var words = suggestion.Content.Split(' ');
                var filterWords = new List<string>();

                foreach (var word in words)
                {
                    if (filterWords.Count == 0 || !char.IsUpper(word[0]))
                    {
                        filterWords.Add(word);
                    }
                }
                return new Suggestions
                {
                    Id = suggestion.Id,
                    Content = string.Join(' ', filterWords),
                    Rating = suggestion.Rating
                };
            }).ToList();

            // Chi nhan toi da 250 ky tu cuar Suggestion
            List<Suggestions> finalSuggestions = new List<Suggestions>();
            foreach(var item in filterObj)
            {
                finalSuggestions.Add(new Suggestions
                {
                    Id = item.Id,
                    Content = item.Content.Substring(0, Math.Min(item.Content.Length, 250)),
                    Rating = item.Rating
                });
            }

            return Ok(new
            {
                Suggestions = finalSuggestions
            });
        }

        // GET: api/Suggestions/5
        //[HttpGet("{id}")]
        //public async Task<ActionResult<Suggestions>> GetSuggestions(int id)
        //{
        //    var suggestions = await _context.Suggestion.FindAsync(id);

        //    if (suggestions == null)
        //    {
        //        return NotFound();
        //    }

        //    return suggestions;
        //}

        //// PUT: api/Suggestions/5
        //// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPut("{id}")]
        //public async Task<IActionResult> PutSuggestions(int id, Suggestions suggestions)
        //{
        //    if (id != suggestions.Id)
        //    {
        //        return BadRequest();
        //    }

        //    _context.Entry(suggestions).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!SuggestionsExists(id))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return NoContent();
        //}

        //// POST: api/Suggestions
        //// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPost]
        //public async Task<ActionResult<Suggestions>> PostSuggestions(Suggestions suggestions)
        //{
        //    _context.Suggestion.Add(suggestions);
        //    await _context.SaveChangesAsync();

        //    return CreatedAtAction("GetSuggestions", new { id = suggestions.Id }, suggestions);
        //}

        //// DELETE: api/Suggestions/5
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteSuggestions(int id)
        //{
        //    var suggestions = await _context.Suggestion.FindAsync(id);
        //    if (suggestions == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.Suggestion.Remove(suggestions);
        //    await _context.SaveChangesAsync();

        //    return NoContent();
        //}

        // khi click Sao chep, thi se update rating cua Suggestion len 1 don vi => anh huong order by
        [HttpPatch("{id}")]
        [Authorize]
        public async Task<IActionResult> UpVoteRating(int id)
        {
            var getSuggestion = await _context.Suggestion.FindAsync(id);

            if (getSuggestion == null)
            {
                return NotFound();
            }

            getSuggestion.Rating += 1;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) when (!_context.Suggestion.Any(e => e.Id == id))
            {
                return NotFound();
            }


            return NoContent();
        }


        private bool SuggestionsExists(int id)
        {
            return _context.Suggestion.Any(e => e.Id == id);
        }
    }
}
