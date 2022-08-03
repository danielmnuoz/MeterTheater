using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MeterTheater.MeterTheaterDB;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using System.DirectoryServices;
using System.Diagnostics;
using System.Runtime.Versioning;

namespace MeterTheater.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class LoginsController : ControllerBase
    {

        private readonly MeterTheaterDBContext _context;

        public LoginsController(MeterTheaterDBContext context)
        {
            _context = context;
        }

        // GET: api/Logins/Logout
        [HttpGet("Logout")]
        public async Task<IActionResult> Logout()
        {
            // Clear the existing external cookie
            await HttpContext.SignOutAsync(
                CookieAuthenticationDefaults.AuthenticationScheme);

            return Ok();
        }

        [HttpGet("GetLogin")]
        public async Task<ActionResult<IEnumerable<User>>> GetLogin()
        {
            var name = HttpContext.User.Claims.FirstOrDefault(e => e.Type == ClaimTypes.Name);
            if(name == null)
            {
                return NoContent();
            }
            else
            {
                return await _context.Users.Where(e => e.UserName == name.Value).ToListAsync();
            }
        }

        [HttpGet("CheckLogin")]
        [AllowAnonymous]
        public Boolean CheckLogin()
        {
            var identity = HttpContext.User.Identity;
            if(identity == null)
            {
                return false;
            }
            return identity.IsAuthenticated;
        }

        // POST: api/Logins/Login
        [HttpPost("Login")]
        [AllowAnonymous]
        //[SupportedOSPlatform("Windows")]
        public async Task<ActionResult<User>> Login([FromBody] string userName)
        {


            //DirectoryEntry de = new("LDAP://bm.net");

            //DirectorySearcher ds = new(de)
            //{
            //    Filter = "(&(objectCategory=User)(objectClass=person))"
            //};

            //SearchResultCollection results = ds.FindAll();

            //foreach (SearchResult sr in results)
            //{
            //    // Using the index zero (0) is required!
            //    Debug.WriteLine(sr.Properties["name"][0].ToString());
            //}


            var users = await _context.Users.Where(e => e.UserName == userName).ToListAsync();
            if (users.Count <= 0)
            {
                return NoContent();
            }

            // assumes unique
            var user = users.First();

            var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.Role, "User"),
        };

            var claimsIdentity = new ClaimsIdentity(
                claims, CookieAuthenticationDefaults.AuthenticationScheme);

            var authProperties = new AuthenticationProperties
            {

            };

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity),
                authProperties);

            return user;
        }
    }
}
