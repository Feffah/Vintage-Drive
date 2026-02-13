using System.ComponentModel.DataAnnotations;

namespace Vintage_Drive.Models.Entities
{
    public class CarImage
    {
        [Key]
        public Guid ImageId { get; set; }

        public string ImageUrl { get; set; }

        // FK
        public Guid CarId { get; set; }
        public Cars Car { get; set; }
    }

}
