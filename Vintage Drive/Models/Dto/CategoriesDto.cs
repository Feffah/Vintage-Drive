namespace Vintage_Drive.Models.Dto
{
    public class CategoriesDto
    {
        public Guid CategoryId { get; set; }  // Identificativo univoco della categoria

        public string Name { get; set; }      // Nome della categoria (muscleCar, sportCar, importazione, ecc.)
    }
}
