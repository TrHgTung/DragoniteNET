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

namespace DragoniteNET.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MailController : ControllerBase
    {
        private readonly DtaContext _context;
        public readonly IEmailService _emailsv;

        public MailController(DtaContext context, IEmailService emailService)
        {
            _context = context;
            _emailsv = emailService;
        }

        // GET: api/Mail
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Mails>>> GetMail()
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.UserData)?.Value; // lay gia tri UserId tu Claim

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Yêu cầu đăng nhập");
            }

            var getMails = await _context.Mail
                        .Where(m => m.UserId == userId)
                        .ToListAsync();

            return Ok(new { 
                UserId = userId,
                Mails = getMails,
            });
        }

        // POST api/Mail        
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Mails>> SaveMail([FromForm]  MailDto mailDto)
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.UserData)?.Value; // lay gia tri UserId tu Claim
            var userEmail = User.Claims.FirstOrDefault(d => d.Type == ClaimTypes.Email)?.Value; // lay gia tri email tu Claim
            var rand = new Random();
            var mail = new Mails
            {
                MailId = "MAIL_" + rand.Next(11111, 99999),
                UserId = userId,
                FromAddress = userEmail,
                ToAddress = mailDto.ToAddress,
                MailSubject = mailDto.MailSubject,
                MailContent = mailDto.MailContent,
                Attachment = mailDto.Attachment,
                Status = "n",
                TimeSent = DateTime.Now.ToString("d/m/yyyy"),
            };

            _context.Mail.Add(mail);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMail", new { id = mail.Id }, mail);

            //return Ok(new
            //{
            //    User_Email = userEmail,
            //});
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendMails()
        {
            var smtpPassword = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.SerialNumber)?.Value; // lay gia tri UserId tu Claim
            var fromAddress = User.Claims.FirstOrDefault(d => d.Type == ClaimTypes.Email)?.Value;

            var getMails = await _context.Mail.Where(a => a.Status == "n").ToListAsync();
            
            foreach(var mail in getMails)
            {
                await _emailsv.SendEmailAsync(mail, fromAddress, smtpPassword);

                mail.Status = "y";
                mail.TimeSent = DateTime.Now.ToString();
            }

            await _context.SaveChangesAsync();

            return Ok("Đã gửi đi các e-mail (200)");
        }

        private bool MailsExists(int id)
        {
            return _context.Mail.Any(e => e.Id == id);
        }
    }
}
