using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using WA1.Entities;
using WA1.Entities.dto; // DTO dosyaların bu klasördeyse
using WA1.DataAccess; // Context dosyan bu klasördeyse

namespace WA1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly TodoContext _context;

        
        public AuthController(TodoContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(UserDto request)
        {
            
            if (await _context.Users.AnyAsync(u => u.Username == request.Username))
                return BadRequest("Böyle bir kullanıcı zaten var!");

            // Şifre güçlülük kontrolü
            if (request.Password.Length < 6 || !request.Password.Any(char.IsUpper))
                return BadRequest("Şifre 6 karakterden uzun olmalı ve büyük harf içermeli.");
            
            // 1. Şifreyi hash'le ve salt'ı üret
            CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt);
            

            // 2. Yeni User nesnesini oluştur
            var user = new User
            {
                Username = request.Username,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt
            };

            // 3. Veritabanına kaydet
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(user);
        }
        
        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(passwordHash);
            }
        }
        
        [HttpPost("login")]
        public async Task<ActionResult<User>> Login(UserDto request)
        {
            // 1. Kullanıcı veritabanında var mı?
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
    
            if (user == null)
            {
                return BadRequest("Kullanıcı bulunamadı.");
            }

            // 2. Girdiği şifre, veritabanındaki hash ile uyuşuyor mu?
            if (!VerifyPasswordHash(request.Password, user.PasswordHash, user.PasswordSalt))
            {
                return BadRequest("Hatalı şifre!");
            }

            // 3. Her şey doğruysa şimdilik bir onay mesajı dönelim
            return Ok(user);
        }

        
        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
        }
        
        
        
    }
}