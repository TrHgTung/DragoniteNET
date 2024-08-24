using System.ComponentModel.DataAnnotations;

namespace DragoniteNET.Models
{
    public class Mails
    {
        [Key]
        public Guid Id { get; set; }
        public string MailId { get; set; }
        public string UserId { get; set; }
        public string FromAddress { get; set; }
        public string ToAddress { get; set; }
        public string? Attachment { get; set; }
        [MaxLength(100)]
        public string MailSubject { get; set; }
        [MaxLength(300)]
        public string MailContent { get; set; }
        public string Status { get; set; }
        public string TimeSent { get; set; }
    }
}
