namespace DragoniteNET.Models
{
    public class Users
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string DisplayName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string SMTPPassword { get; set; }
    }
}
