namespace DragoniteNET.Dto
{
    public class UserDto
    {
        public class UserRegisterDto
        {
            public string UserId { get; set; }
            public string Email { get; set; }
            public string DisplayName { get; set; }
            public string Password { get; set; }
            public string SMTPPassword { get; set; }
        }

        public class UserLoginDto
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }
    }
}
