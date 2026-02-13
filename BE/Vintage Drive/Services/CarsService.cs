using Microsoft.EntityFrameworkCore;
using Vintage_Drive.Data;
using Vintage_Drive.Models.Dto;
using Microsoft.AspNetCore.Hosting;

using Vintage_Drive.Models.Entities;
namespace Vintage_Drive.Services
{
    public class CarsService
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public CarsService(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        //GET ALL
        public async Task<List<CarsDto>> GetAllCarsAsync()
        {
            return await _context.Cars
                .Include(c => c.Categories) 
                .Include(c => c.Images) 
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

                    // Map delle categorie
                    Categories = c.Categories
                        .Select(cat => new CategoriesDto
                        {
                            CategoryId = cat.CategoryId,
                            Name = cat.Name
                        }).ToList(),

                    // Map delle immagini
                    Images = c.Images
                        .Select(img => new CarImageDto
                        {
                            ImageId = img.ImageId,
                            CarId = img.CarId,
                            ImageUrl = img.ImageUrl
                        }).ToList()
                })
                .ToListAsync();
        }



        //GET BY ID

        public async Task<CarsDto?> GetCarByIdAsync(Guid carId)
        {
            return await _context.Cars
                .Where(c => c.CarId == carId)
                .Include(c => c.Categories) 
                .Include(c => c.Images) 
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

                    // Map delle categorie
                    Categories = c.Categories
                        .Select(cat => new CategoriesDto
                        {
                            CategoryId = cat.CategoryId,
                            Name = cat.Name
                        }).ToList(),

                    // Map delle immagini
                    Images = c.Images
                        .Select(img => new CarImageDto
                        {
                            ImageId = img.ImageId,
                            CarId = img.CarId,
                            ImageUrl = img.ImageUrl
                        }).ToList()
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
            await _context.SaveChangesAsync(); // Serve per avere CarId salvato

            if (car.UploadedImages != null && car.UploadedImages.Count > 0)
            {
                var folderPath = Path.Combine(_env.WebRootPath, "images/cars");
                if (!Directory.Exists(folderPath)) Directory.CreateDirectory(folderPath);

                foreach (var file in car.UploadedImages)
                {
                    if (file.Length > 0)
                    {
                        var fileName = $"{Guid.NewGuid()}_{file.FileName}";
                        var fullPath = Path.Combine(folderPath, fileName);

                        using (var stream = new FileStream(fullPath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }

                        var carImage = new Models.Entities.CarImage
                        {
                            ImageId = Guid.NewGuid(),
                            CarId = newCar.CarId,
                            ImageUrl = $"/images/cars/{fileName}"
                        };

                        _context.CarImage.Add(carImage);
                    }
                }

                await _context.SaveChangesAsync(); // Salva le immagini
            }
            foreach (var img in newCar.Images)
            {
                img.Car = null;
            }

            return newCar!;
        }



        //UPDATE

        public async Task<Models.Entities.Cars?> UpdateCarAsync(Guid carId, Models.Dto.CarsDto updatedCar)
        {
            var existingCar = await _context.Cars
                .Include(c => c.Images) // Include immagini esistenti
                .FirstOrDefaultAsync(c => c.CarId == carId);

            if (existingCar == null)
                return null;
            updatedCar.CarId = carId;
            // Aggiorna le proprietà dell'auto esistente (esclude la lista Images)
            _context.Entry(existingCar).CurrentValues.SetValues(updatedCar);

            // Gestione nuove immagini caricate
            if (updatedCar.UploadedImages != null && updatedCar.UploadedImages.Count > 0)
            {
                var folderPath = Path.Combine(_env.WebRootPath, "images/cars");
                if (!Directory.Exists(folderPath)) Directory.CreateDirectory(folderPath);

                foreach (var file in updatedCar.UploadedImages)
                {
                    if (file.Length > 0)
                    {
                        var fileName = $"{Guid.NewGuid()}_{file.FileName}";
                        var fullPath = Path.Combine(folderPath, fileName);

                        using (var stream = new FileStream(fullPath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }

                        var carImage = new Models.Entities.CarImage
                        {
                            ImageId = Guid.NewGuid(),
                            CarId = existingCar.CarId,
                            ImageUrl = $"/images/cars/{fileName}"
                        };

                        _context.CarImage.Add(carImage);
                    }
                }
            }

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
