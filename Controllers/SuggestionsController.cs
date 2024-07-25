using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DragoniteNET.DataContext;
using DragoniteNET.Models;

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
            return await _context.Suggestion.ToListAsync();
        }

        // GET: api/Suggestions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Suggestions>> GetSuggestions(int id)
        {
            var suggestions = await _context.Suggestion.FindAsync(id);

            if (suggestions == null)
            {
                return NotFound();
            }

            return suggestions;
        }

        // PUT: api/Suggestions/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSuggestions(int id, Suggestions suggestions)
        {
            if (id != suggestions.Id)
            {
                return BadRequest();
            }

            _context.Entry(suggestions).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SuggestionsExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Suggestions
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Suggestions>> PostSuggestions(Suggestions suggestions)
        {
            _context.Suggestion.Add(suggestions);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSuggestions", new { id = suggestions.Id }, suggestions);
        }

        // DELETE: api/Suggestions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSuggestions(int id)
        {
            var suggestions = await _context.Suggestion.FindAsync(id);
            if (suggestions == null)
            {
                return NotFound();
            }

            _context.Suggestion.Remove(suggestions);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SuggestionsExists(int id)
        {
            return _context.Suggestion.Any(e => e.Id == id);
        }
    }
}
