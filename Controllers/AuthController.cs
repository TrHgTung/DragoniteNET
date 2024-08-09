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
using Microsoft.AspNetCore.Authorization;
using NuGet.Protocol;
using Newtonsoft.Json;
using System.Collections.Immutable;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;

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

        // Taoj token user
        private string CreateToken(Users user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.DisplayName),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.UserData, user.UserId),
                new Claim(ClaimTypes.NameIdentifier, user.UserId),
                new Claim(ClaimTypes.SerialNumber, user.SMTPPassword),
                new Claim(ClaimTypes.CookiePath, user.ToJson()),
                new Claim(ClaimTypes.Actor, user.Id.ToString()),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(6),
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

            if (string.IsNullOrEmpty(request.Password))
            {
                return BadRequest(new
                {
                    request = (request),
                    message = "Password không được để trống."
                });
            }
            
            var rand = new Random();
            var initUserId = rand.Next(11111, 99999);

            var user = new Users
            {
                UserId = "UID_" + initUserId,
                DisplayName = request.DisplayName,
                Email = request.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
                SMTPPassword = request.SMTPPassword,
                Status = 1
            };

            _context.User.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = "Đã tạo thành công tài khoản: " + request.Email
            });
        }

        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> Profile()
        {
            var userData = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.CookiePath)?.Value;
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            return Ok(new
            {
                user_id = userId,
                User_information = userData
            });
        }

        // POST: login
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserDto.UserLoginDto request)
        {
            var user = await _context.User.SingleOrDefaultAsync(u => u.Email == request.Email); // lay ra thong tin user
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            {
                return Unauthorized("Thông tin đăng nhập sai");
            }
            else if (user.Status == 0)
            {
                return Unauthorized("Tài khoản đã bị khóa");
            }

            var token = CreateToken(user);

            var displayName = user.DisplayName;
            var getSmtpPassword = user.SMTPPassword;
            var getUserStatus = user.Status;

            return Ok(new
            {
                token = token,
                SMTP_pswrd = getSmtpPassword,
                user = user,
                display_name = displayName,
                status = getUserStatus,
            });
        }

        // Dang ky VIP >> cho phep queue nhieu mails
        [HttpPatch("vip")]
        [Authorize]
        public async Task<IActionResult> RegisterVip()
        {
            var getGuidID = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Actor)?.Value;
            var guid = new Guid(getGuidID);
            //var getUser = await _context.User.Any(e => e.Id == guid);
            var getUser = await _context.User.FindAsync(guid);

            if (getUser == null)
            {
                return NotFound();
            }
            getUser.Status = 2;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) when (!_context.User.Any(e => e.Id == guid))
            { 
                return NotFound();
            }
            //await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPatch("unvip")]
        [Authorize]
        public async Task<IActionResult> UnVip()
        {
            var getGuidID = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Actor)?.Value;
            var guid = new Guid(getGuidID);
            //var getUser = await _context.User.Any(e => e.Id == guid);
            var getUser = await _context.User.FindAsync(guid);

            if (getUser == null)
            {
                return NotFound();
            }
            getUser.Status = 1; // check status

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) when (!_context.User.Any(e => e.Id == guid))
            {
                return NotFound();
            }
            //await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
