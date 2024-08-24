using System.ComponentModel.DataAnnotations;

namespace DragoniteNET.Dto
{
    public class MailDto
    {
        [Required]
        public string ToAddress { get; set; }
        [Required]
        [MaxLength(100)]
        public string MailSubject { get; set; }
        [Required]
        [MaxLength(300)]
        public string MailContent { get; set; }
        public IFormFile? Attachment { get; set; }
    }
}
