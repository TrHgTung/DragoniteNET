using DragoniteNET.Config;
using DragoniteNET.Dto;
using DragoniteNET.Interface;
using DragoniteNET.Models;
using Microsoft.Extensions.Options;
using MimeKit;
using MailKit.Net.Smtp;

namespace DragoniteNET.Services
{
    public class EmailService : IEmailService
    {
        private readonly SmtpSettings _smtpSettings;
        public EmailService(IOptions<SmtpSettings> smtpSettings)
        {
            _smtpSettings = smtpSettings.Value;
        }
        public async Task SendEmailAsync(Mails mail, string fromAddress, string smtpPassword)
        {
            var email = new MimeMessage();
            email.From.Add(new MailboxAddress(fromAddress, fromAddress));
            email.To.Add(new MailboxAddress(mail.ToAddress, mail.ToAddress));
            email.Subject = mail.MailSubject;
            var builder = new BodyBuilder { HtmlBody = mail.MailContent };

            // Add attachment if exists
            if (!string.IsNullOrEmpty(mail.Attachment))
            {
                builder.Attachments.Add(mail.Attachment);
            }

            email.Body = builder.ToMessageBody();

            using var smtp = new SmtpClient();
            smtp.Connect(_smtpSettings.Server, _smtpSettings.Port, MailKit.Security.SecureSocketOptions.StartTls);
            smtp.Authenticate(fromAddress, smtpPassword);
            await smtp.SendAsync(email);
            smtp.Disconnect(true);
        }

     
    }
}
