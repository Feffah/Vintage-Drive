using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Vintage_Drive.Models.Dto;
using Vintage_Drive.Models.Entities;

namespace Vintage_Drive.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly Services.UsersService _usersService;
        private readonly UserManager<Users> _userManager;
        private readonly SignInManager<Users> _signInManager;
        public UsersController(Services.UsersService usersService, UserManager<Users> userManager, SignInManager<Users> signInManager)
        {
            _usersService = usersService;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        //GET ALL

        [HttpGet]

        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _usersService.GetAllUsersAsync();
            return Ok(users);
        }

        //GET BY ID

        [HttpGet("{id}")]

        public async Task<IActionResult> GetUserById(string id)
        {
            var user = await _usersService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        //CREATE
        [HttpPost]
        public async Task<IActionResult> CreateUser(Models.Dto.UsersDto user)
        {
            var createdUser = await _usersService.CreateUserAsync(user);
            return CreatedAtAction(nameof(GetUserById), new { id = createdUser.Id }, createdUser);
        }

        //UPDATE

        [HttpPut("{id}")]

        public async Task<IActionResult> UpdateUser(string id, Models.Dto.UsersDto updatedUser)
        {
            var user = await _usersService.UpdateUserAsync(id, updatedUser);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        //DELETE

        [HttpDelete("{id}")]

        public async Task<IActionResult> DeleteUser(string id)
        {
            var result = await _usersService.DeleteUserAsync(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequestDto loginRequestDto)
        {
            try
            {
                Users user = await _userManager.FindByNameAsync(loginRequestDto.UserName);

                if (user is null)
                    return Unauthorized("Utente non trovato");

                var result = await _signInManager.PasswordSignInAsync(
                    user,
                    loginRequestDto.Password,
                    false,
                    false
                );

                if (!result.Succeeded)
                    return Unauthorized("Password non valida");

                // 🔥 Recupero ruoli
                List<string> roles = (await _userManager.GetRolesAsync(user)).ToList();

                // 🔥 Claims
                List<Claim> userClaims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Name, user.UserName)
        };

                foreach (string roleName in roles)
                {
                    userClaims.Add(new Claim(ClaimTypes.Role, roleName));
                }

                var key = Encoding.UTF8.GetBytes(
                    "11b57b25e1c4a98e5a1b51e9bc3a480c9d03bcb8a3b98662fd00183f684d37a1"
                );

                var cred = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256
                );

                var tokenExpiration = DateTime.UtcNow.AddMinutes(30);

                var jwt = new JwtSecurityToken(
                    issuer: "https://",
                    audience: "https://",
                    claims: userClaims,
                    expires: tokenExpiration,
                    signingCredentials: cred
                );

                string token = new JwtSecurityTokenHandler().WriteToken(jwt);

                // 🔥 RESPONSE COMPLETO
                return Ok(new
                {
                    token = token,
                    expiration = tokenExpiration,
                    userId = user.Id,
                    userName = user.UserName,
                    roles = roles
                });
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

    }
}
