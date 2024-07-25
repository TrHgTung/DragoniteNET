using DragoniteNET.Dto;
using DragoniteNET.Models;

namespace DragoniteNET.Interface
{
    public interface IEmailService
    {
        Task SendEmailAsync(Mails mail, string fromAddress, string smtpPassword);
    }
}
