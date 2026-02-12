using Microsoft.EntityFrameworkCore;
using Vintage_Drive.Data;
using Vintage_Drive.Models.Dto;
using Vintage_Drive.Models.Entities;
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
        public async Task<List<CarsDto>> GetAllCarsAsync()
        {
            return await _context.Cars
                .Select(c => new CarsDto
                {
                    CarId = c.CarId,
                    Make = c.Make,
                    Model = c.Model,
                    Version = c.Version,
                    Year = c.Year,
                    VIN = c.VIN,
                    LicensePlate = c.LicensePlate,
                    EngineType = c.EngineType,
                    EngineDisplacement = c.EngineDisplacement,
                    HorsePower = c.HorsePower,
                    Torque = c.Torque,
                    Transmission = c.Transmission,
                    Gears = c.Gears,
                    ExteriorColor = c.ExteriorColor,
                    InteriorColor = c.InteriorColor,
                    InteriorMaterial = c.InteriorMaterial,
                    Mileage = c.Mileage,
                    FuelType = c.FuelType,
                    FuelConsumption = c.FuelConsumption,
                    BodyStyle = c.BodyStyle,
                    OwnersCount = c.OwnersCount,
                    HasOriginalDocuments = c.HasOriginalDocuments,
                    Condition = c.Condition,
                    IsAsiCertified = c.IsAsiCertified,
                    CertificationDate = c.CertificationDate,
                    IsRoadLegal = c.IsRoadLegal,
                    LastInspectionDate = c.LastInspectionDate,
                    Description = c.Description,
                    Price = c.Price,
                    CarStatus = c.CarStatus,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt,
                    PublishedAt = c.PublishedAt,
                    IsVisible = c.IsVisible,
                    Categories = c.Categories
                        .Select(cat => new CategoriesDto
                        {
                            CategoryId = cat.CategoryId,
                            Name = cat.Name
                        }).ToList()
                })
                .ToListAsync();
        }


        //GET BY ID

        public async Task<CarsDto?> GetCarByIdAsync(Guid carId)
        {
            return await _context.Cars
                .Where(c => c.CarId == carId)
                .Select(c => new CarsDto
                {
                    CarId = c.CarId,
                    Make = c.Make,
                    Model = c.Model,
                    Version = c.Version,
                    Year = c.Year,
                    VIN = c.VIN,
                    LicensePlate = c.LicensePlate,
                    EngineType = c.EngineType,
                    EngineDisplacement = c.EngineDisplacement,
                    HorsePower = c.HorsePower,
                    Torque = c.Torque,
                    Transmission = c.Transmission,
                    Gears = c.Gears,
                    ExteriorColor = c.ExteriorColor,
                    InteriorColor = c.InteriorColor,
                    InteriorMaterial = c.InteriorMaterial,
                    Mileage = c.Mileage,
                    FuelType = c.FuelType,
                    FuelConsumption = c.FuelConsumption,
                    BodyStyle = c.BodyStyle,
                    OwnersCount = c.OwnersCount,
                    HasOriginalDocuments = c.HasOriginalDocuments,
                    Condition = c.Condition,
                    IsAsiCertified = c.IsAsiCertified,
                    CertificationDate = c.CertificationDate,
                    IsRoadLegal = c.IsRoadLegal,
                    LastInspectionDate = c.LastInspectionDate,
                    Description = c.Description,
                    Price = c.Price,
                    CarStatus = c.CarStatus,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt,
                    PublishedAt = c.PublishedAt,
                    IsVisible = c.IsVisible,

                    // Mapping delle categorie associate
                    Categories = c.Categories
                        .Select(cat => new CategoriesDto
                        {
                            CategoryId = cat.CategoryId,
                            Name = cat.Name
                        })
                        .ToList()
                })
                .FirstOrDefaultAsync();
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
            updatedCar.CarId = carId;
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


        //GET BY CATEGRORY

        public async Task<List<Models.Entities.Cars>> GetCarsByCategoryAsync(Guid categoryId)
        {
            return await _context.Cars
                .Where(c => c.Categories.Any(cat => cat.CategoryId == categoryId))
                .ToListAsync();
        }
    }
}
