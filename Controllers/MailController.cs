﻿using System;
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
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using DragoniteNET.Dto;
using DragoniteNET.Interface;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.RateLimiting;

namespace DragoniteNET.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MailController : ControllerBase
    {
        private readonly DtaContext _context;
        //private readonly PagnitionDto _pagination;
        public readonly IEmailService _emailsv;

        public MailController(DtaContext context, IEmailService emailService/*, PagnitionDto pagnitionDto*/)
        {
            _context = context;
            _emailsv = emailService;
            //_pagination = pagnitionDto;
        }

        // GET: api/Mail
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Mails>>> GetMail()
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value; // lay gia tri UserId tu Claim

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Yêu cầu đăng nhập");
            }

            var getMails = await _context.Mail
                        .Where(m => m.UserId == userId)
                        .Where(m => m.Status == "n")
                        .ToListAsync();
          
            var getSentMails_HistoryMail = await _context.Mail
                        .Where(m => m.UserId == userId)
                        .Where(m => m.Status == "y")
                        .OrderByDescending(m => m.TimeSent)
                        .Take(2)
                        .ToListAsync();

            var historyMailCount =  _context.Mail
                        .Where(m => m.UserId == userId)
                        .Where(m => m.Status == "y")
                        .ToList()
                        .Count();

            return Ok(new { 
                UserId = userId,
                data = getMails,
                all_mails_sent = getSentMails_HistoryMail,
                the_number_of_mail_sent = historyMailCount, // Pagintion > Item Number
            });
        }

        [HttpPost("pagination")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Mails>>> Pagination([FromBody] PagnitionDto pagnitionDto)
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.UserData)?.Value; // lay gia tri UserId tu Claim
            int pageSize = (int)(Math.Floor(pagnitionDto.ItemNumber / 5.0));
            int pageIndex = (pagnitionDto.PageIndex);

            var getSentMails = await _context.Mail
                        .Where(m => m.UserId == userId)
                        .Where(m => m.Status == "y")
                        .Skip((pageIndex - 1) * pageSize)
                        .Take(pageSize)
                        .ToListAsync();

            return Ok(new
            {
                sent_mails_by_pageIndex = getSentMails
            });
        }

        // POST api/Mail        
        [HttpPost]
        [Authorize]
        [EnableRateLimiting("LimitedRequests")] // use policy
        [RequestFormLimits(MultipartBodyLengthLimit = 10000000)]
        public async Task<IActionResult> SaveMail([FromForm]  MailDto mailDto)
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value; // lay gia tri UserId tu Claim
            var userEmail = User.Claims.FirstOrDefault(d => d.Type == ClaimTypes.Email)?.Value; // lay gia tri email tu Claim
            var rand = new Random();

            string attachmentPath = null;
            if(mailDto.Attachment != null)
            {
                var attachmentFullName = Path.GetRandomFileName() + "__" + Path.GetFileNameWithoutExtension(mailDto.Attachment.FileName) + Path.GetExtension(mailDto.Attachment.FileName);
                attachmentPath = Path.Combine("FileStorage", attachmentFullName);

                using (var stream = new FileStream(attachmentPath, FileMode.Create))
                {
                    await mailDto.Attachment.CopyToAsync(stream);
                }
            }

            var mail = new Mails
            {
                MailId = "MAIL_" + rand.Next(11111, 99999),
                UserId = userId,
                FromAddress = userEmail,
                ToAddress = mailDto.ToAddress,
                MailSubject = mailDto.MailSubject,
                MailContent = mailDto.MailContent,
                Attachment = attachmentPath,
                Status = "n",
                TimeSent = DateTime.UtcNow.ToShortTimeString(),
            };

            var suggestion = new Suggestions
            {
                Content = mailDto.MailContent,
                Rating = 1
            };

            _context.Mail.Add(mail);
            _context.Suggestion.Add(suggestion);

            await _context.SaveChangesAsync();

            //return CreatedAtAction("GetMail", new { id = mail.Id }, mail);

            return Ok(new
            {
                Mail = mail,
                Suggestion = suggestion,
            });
        }


        // POST vip/post (VIP request for VIP accounts)      
        [HttpPost("/vip/post")]
        [Authorize]
        [EnableRateLimiting("LimitedVipRequests")] // use policy (VIP)
        [RequestFormLimits(MultipartBodyLengthLimit = 20000000)]
        public async Task<IActionResult> SaveVipMail([FromForm] MailDto mailDto)
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value; // lay gia tri UserId tu Claim
            var userEmail = User.Claims.FirstOrDefault(d => d.Type == ClaimTypes.Email)?.Value; // lay gia tri email tu Claim
            var rand = new Random();

            string attachmentPath = null;
            if (mailDto.Attachment != null)
            {
                var attachmentFullName = Path.GetRandomFileName() + "__" + Path.GetFileNameWithoutExtension(mailDto.Attachment.FileName) + Path.GetExtension(mailDto.Attachment.FileName);
                attachmentPath = Path.Combine("FileStorage", attachmentFullName);

                using (var stream = new FileStream(attachmentPath, FileMode.Create))
                {
                    await mailDto.Attachment.CopyToAsync(stream);
                }
            }

            var mail = new Mails
            {
                MailId = "MAIL_" + rand.Next(11111, 99999),
                UserId = userId,
                FromAddress = userEmail,
                ToAddress = mailDto.ToAddress,
                MailSubject = mailDto.MailSubject,
                MailContent = mailDto.MailContent,
                Attachment = attachmentPath,
                Status = "n",
                TimeSent = DateTime.UtcNow.ToShortTimeString(),
            };

            var suggestion = new Suggestions
            {
                Content = mailDto.MailContent,
                Rating = 1
            };

            _context.Mail.Add(mail);
            _context.Suggestion.Add(suggestion);

            await _context.SaveChangesAsync();

            //return CreatedAtAction("GetMail", new { id = mail.Id }, mail);

            return Ok(new
            {
                Mail = mail,
                Suggestion = suggestion,
            });
        }

        [HttpPost("send")]
        [Authorize]
        public async Task<IActionResult> SendMails([FromBody] SendMailRequest data)
        {
            string email = data.Email;
            string smtp = data.Smtp;

            var smtpPassword = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.SerialNumber)?.Value; // lay tu Claim
            var fromAddress = User.Claims.FirstOrDefault(d => d.Type == ClaimTypes.Email)?.Value;

            if (email != fromAddress || smtp != smtpPassword)
            {
                return Unauthorized("Xác thực không đúng.");
            }

            var getMails = await _context.Mail.Where(a => a.Status == "n").ToListAsync();
            try
            {
                foreach (var mail in getMails)
                {
                    await _emailsv.SendEmailAsync(mail, fromAddress, smtpPassword);

                    mail.Status = "y";
                    mail.TimeSent = DateTime.UtcNow.ToShortTimeString();
                }

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Đã gửi đi các e-mail" });
            }
            catch (Exception e)
            {
                return StatusCode(500, $"Đã có lỗi xảy ra: {e.Message}");
            }
        }

    
        // khi click Ẩn thư, thi se update status cua mail la "i" => ko hien thi len giao dien chinh
        [HttpPatch("{id}")]
        [Authorize]
        public async Task<IActionResult> RemoveMail(string id/* string mailId, [FromBody] JsonPatchDocument<MailPatchDto> mailPatch*/)
        {
            if (!Guid.TryParse(id, out Guid guidId))
            {
                return BadRequest("Khong dung dinh dang Guid cua Id");
            }

            var getMail = await _context.Mail.FindAsync(guidId);
            //var getMail = await _context.Mail.FirstOrDefaultAsync(p => p.MailId == mailId.ToString());

            if(getMail == null)
            {
                return NotFound();
            }
            getMail.Status = "y"; // cho front end nhan du lieu

            try
            {
                await _context.SaveChangesAsync();
            }
            //catch (DbUpdateConcurrencyException) when (!_context.Mail.Any(e => e.MailId.ToString() == mailId.ToString()))
            //catch (DbUpdateConcurrencyException) when (!_context.Mail.Any(e => e.Id.ToString() == id.ToString()))
            catch (DbUpdateConcurrencyException) when (!_context.Mail.Any(e => e.Id == guidId))
            {
                return NotFound();
            }

            return NoContent();
        }

        private bool MailsExists(int id)
        {
            return _context.Mail.Any(e => e.Id.ToString() == id.ToString());
        }
    }
}
