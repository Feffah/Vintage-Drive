namespace Vintage_Drive.Models.Dto
{
    public class UsersDto
    {
        public string Name { get; set; }

        public string Surname { get; set; }

        public string UserName { get; set; }

        public string Adress { get; set; }

        public string City { get; set; }

        public string Country { get; set; }

        public string Phone { get; set; }

        public string PostalCode { get; set; }

        public string Email { get; set; }

        public string? Password { get; set; }

        public DateTime CreateAt { get; set; }

        public bool IsDeleted { get; set; }
        public DateTime Birthday { get; set; }

        public string? Role { get; set; }
    }
}
