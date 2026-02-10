using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Vintage_Drive.Data;
using Vintage_Drive.Models.Entities;
namespace Vintage_Drive.Services
{
    public class UsersService
    {
        private readonly ApplicationDbContext _context;        
        private readonly UserManager<Users> _userManager;
        private readonly SignInManager<Users> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        public UsersService(ApplicationDbContext context,
            UserManager<Users> userManager,
            SignInManager<Users> signInManager,
            RoleManager<IdentityRole> roleManager)
        {
            _context = context;   
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
        }


        //GET ALL

        public async Task<List<Models.Entities.Users>> GetAllUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }

        //GET BY ID

        public async Task<Models.Entities.Users?> GetUserByIdAsync(string userId)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        }

        //CREATE

        public async Task<Models.Entities.Users> CreateUserAsync(Models.Dto.UsersDto user)
        {
            var newUser = new Models.Entities.Users
            {
                Id = Guid.NewGuid().ToString(),
                UserName = user.UserName,
                Email = user.Email,
                Name = user.Name,
                Surname = user.Surname,
                Adress = user.Adress,
                City = user.City,
                Country = user.Country,
                Phone = user.Phone,
                PostalCode = user.PostalCode,
                CreateAt = user.CreateAt,
                IsDeleted = user.IsDeleted,
                Birthday = user.Birthday
            };

            IdentityResult result = await _userManager.CreateAsync(newUser, user.Password);
            if (result.Succeeded)
            {
                ApplicationRole role = new ApplicationRole()
                {
                    Name = user.Role != null ? user.Role : "User",
                    Role = user.Role != null ? user.Role : "User",
                    Id = Guid.NewGuid().ToString(),
                    NormalizedName = user.Role != null ? user.Role.ToUpper() : "USER",
                };
                var roleExist = await this._roleManager.RoleExistsAsync(role.Name);
                if (!roleExist)
                {
                    await this._roleManager.CreateAsync(role);
                }
                await this._userManager.AddToRoleAsync(newUser, role.Name);
            }

            return newUser;
        }

        //UPDATE

        public async Task<Models.Entities.Users?> UpdateUserAsync(string userId, Models.Dto.UsersDto updatedUser)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (existingUser == null)
            {
                return null;
            }
            // Aggiorna le proprietà dell'utente esistente
            _context.Entry(existingUser).CurrentValues.SetValues(updatedUser);
            await _context.SaveChangesAsync();
            return existingUser;
        }

        //DELETE

        public async Task<bool> DeleteUserAsync(string userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                return false;
            }
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
