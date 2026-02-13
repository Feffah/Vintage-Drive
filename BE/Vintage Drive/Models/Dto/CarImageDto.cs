using Vintage_Drive.Models.Entities;

namespace Vintage_Drive.Models.Dto
{
    public class CarImageDto
    {
        public Guid ImageId { get; set; }

        public string ImageUrl { get; set; }

        public Guid CarId { get; set; }
    }
}
