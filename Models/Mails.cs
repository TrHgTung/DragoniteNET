namespace DragoniteNET.Models
{
    public class Mails
    {
        public int Id { get; set; }
        public string MailId { get; set; }
        public string UserId { get; set; }
        public string FromAddress { get; set; }
        public string ToAddress { get; set; }
        public string? Attachment { get; set; }
        public string MailSubject { get; set; }
        public string MailContent { get; set; }
        public string Status { get; set; }
        public string TimeSent { get; set; }
    }
}
