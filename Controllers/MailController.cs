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
using System.Security.Claims;

namespace DragoniteNET.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MailController : ControllerBase
    {
        private readonly DtaContext _context;

        public MailController(DtaContext context)
        {
            _context = context;
        }

        // GET: api/Mail
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Mails>>> GetMail()
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(email))
            {
                return Unauthorized("userId claim not found.");
            }

            return Ok(new { UserId = email });
        }

        //// GET: api/Mail/5
        //[HttpGet("{id}")]
        //public async Task<ActionResult<Mails>> GetMails(int id)
        //{
        //    var mails = await _context.Mail.FindAsync(id);

        //    if (mails == null)
        //    {
        //        return NotFound();
        //    }

        //    return mails;
        //}

        //// PUT: api/Mail/5
        //// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPut("{id}")]
        //public async Task<IActionResult> PutMails(int id, Mails mails)
        //{
        //    if (id != mails.Id)
        //    {
        //        return BadRequest();
        //    }

        //    _context.Entry(mails).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!MailsExists(id))
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

        // POST: api/Mail
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Mails>> SaveMail(Mails mails)
        {
            _context.Mail.Add(mails);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMails", new { id = mails.Id }, mails);
        }

        //// DELETE: api/Mail/5
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteMails(int id)
        //{
        //    var mails = await _context.Mail.FindAsync(id);
        //    if (mails == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.Mail.Remove(mails);
        //    await _context.SaveChangesAsync();

        //    return NoContent();
        //}

        private bool MailsExists(int id)
        {
            return _context.Mail.Any(e => e.Id == id);
        }
    }
}
