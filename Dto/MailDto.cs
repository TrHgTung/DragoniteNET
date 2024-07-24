using System.ComponentModel.DataAnnotations;

namespace DragoniteNET.Dto
{
    public class MailDto
    {
        [Required]
        public string ToAddress { get; set; }
        [Required]
        public string MailSubject { get; set; }
        [Required]
        public string MailContent { get; set; }
        public string? Attachment { get; set; }
    }
}
