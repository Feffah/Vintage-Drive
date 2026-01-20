using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Vintage_Drive.Models.Entities
{
    public class Users : IdentityUser
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Adress { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string Phone { get; set; }
        public string PostalCode { get; set; }
        public DateTime CreateAt { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime Birthday { get; set; }

        // One-to-many: User -> Orders
        public ICollection<Orders> Orders { get; set; } = new List<Orders>();
    }
}
