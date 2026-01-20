namespace Vintage_Drive.Models.Dto
{

        public class LoginResponseDto
        {
            public string Token { get; set; }
            public DateTime Expiration { get; set; }
        }
    }