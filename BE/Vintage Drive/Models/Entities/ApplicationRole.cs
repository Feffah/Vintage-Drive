using Microsoft.AspNetCore.Identity;

namespace Vintage_Drive.Models.Entities
{
    public class ApplicationRole : IdentityRole
    {
        public string Role { get; set; }
    }
}
