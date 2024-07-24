using DragoniteNET.DataContext;
using DragoniteNET.Dto;
using DragoniteNET.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.Scripting;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace DragoniteNET.Controllers
{
    public class AuthController : Controller
    {
        private readonly DtaContext _context;
        private readonly IConfiguration _config;
        //private readonly UserDto _userDto;

        public AuthController(DtaContext context, IConfiguration configuration/*, UserDto userDto*/)
        {
            _context = context;
            _config = configuration;
            //_userDto = userDto;
        }

        private async Task<bool> UserExists(string email)
        {
            return await _context.User.AnyAsync(u => u.Email == email);
        }

        private string CreateToken(Users user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.DisplayName),
                new Claim(ClaimTypes.Email, user.Email),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserDto.UserRegisterDto request)
        {
            if (await UserExists(request.Email))
            {
                return BadRequest("Email này đã được sử dụng");
            }
            var rand = new Random();
            var initUserId = rand.Next(11111, 99999);

            var user = new Users
            {
                UserId = "UID_" + initUserId,
                DisplayName = request.DisplayName,
                Email = request.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
                SMTPPassword = request.SMTPPassword
            };

            _context.User.Add(user);
            await _context.SaveChangesAsync();

            return Ok("Đã tạo thành công tài khoản" + request.Email);
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserDto.UserLoginDto request)
        {
            var user = await _context.User.SingleOrDefaultAsync(u => u.Email == request.Email); // lay ra thong tin user
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            {
                return Unauthorized("Thông tin đăng nhập sai");
            }

            var token = CreateToken(user);

            return Ok(new { token });
        }
    }
}
