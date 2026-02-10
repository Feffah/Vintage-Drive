using Vintage_Drive.Data;
using Microsoft.EntityFrameworkCore;
namespace Vintage_Drive.Services
{
    public class CarsService
    {
        private readonly ApplicationDbContext _context;
        public CarsService(ApplicationDbContext context)
        {
            _context = context;
        }

        //GET ALL
        public async Task<List<Models.Entities.Cars>> GetAllCarsAsync()
        {
            return await _context.Cars.ToListAsync();
        }

        //GET BY ID

        public async Task<Models.Entities.Cars?> GetCarByIdAsync(Guid carId)
        {
            return await _context.Cars.FirstOrDefaultAsync(c => c.CarId == carId);
        }

        //CREATE

        public async Task<Models.Entities.Cars> CreateCarAsync(Models.Dto.CarsDto car)
            {
            var newCar = new Models.Entities.Cars
            {
                CarId = Guid.NewGuid(),
                Make = car.Make,
                Model = car.Model,
                Year = car.Year,
                Version = car.Version,
                VIN = car.VIN,
                LicensePlate = car.LicensePlate,
                EngineType = car.EngineType,
                EngineDisplacement = car.EngineDisplacement,
                HorsePower = car.HorsePower,
                Torque = car.Torque,
                Transmission = car.Transmission,
                Gears = car.Gears,
                ExteriorColor = car.ExteriorColor,
                InteriorColor = car.InteriorColor,
                InteriorMaterial = car.InteriorMaterial,
                Mileage = car.Mileage,
                FuelType = car.FuelType,
                FuelConsumption = car.FuelConsumption,
                BodyStyle = car.BodyStyle,
                OwnersCount = car.OwnersCount,
                HasOriginalDocuments = car.HasOriginalDocuments,
                Condition = car.Condition,
                IsAsiCertified = car.IsAsiCertified,
                CertificationDate = car.CertificationDate,
                IsRoadLegal = car.IsRoadLegal,
                LastInspectionDate = car.LastInspectionDate,
                Description = car.Description,
                Price = car.Price,
                CarStatus = car.CarStatus,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                PublishedAt = car.PublishedAt,
                IsVisible = car.IsVisible

            };
            _context.Cars.Add(newCar);
            await _context.SaveChangesAsync();
            return newCar;
        }

        //UPDATE

        public async Task<Models.Entities.Cars?> UpdateCarAsync(Guid carId, Models.Dto.CarsDto updatedCar)
        {
            var existingCar = await _context.Cars.FirstOrDefaultAsync(c => c.CarId == carId);
            if (existingCar == null)
            {
                return null;
            }
            // Aggiorna le proprietà dell'auto esistente
            _context.Entry(existingCar).CurrentValues.SetValues(updatedCar);
            await _context.SaveChangesAsync();
            return existingCar;
        }

        //DELETE

        public async Task<bool> DeleteCarAsync(Guid carId)
        {
            var car = await _context.Cars.FirstOrDefaultAsync(c => c.CarId == carId);
            if (car == null)
            {
                return false;
            }
            _context.Cars.Remove(car);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
