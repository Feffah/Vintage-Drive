using Microsoft.EntityFrameworkCore;
using Vintage_Drive.Data;
using Vintage_Drive.Models.Dto;
using Vintage_Drive.Models.Entities;
namespace Vintage_Drive.Services
{
    public class CategoriesService
    {
        private readonly ApplicationDbContext _context;
        public CategoriesService(ApplicationDbContext context)
        {
            _context = context;
        }
        //GET ALL
        public async Task<List<Models.Entities.Categories>> GetAllCategoriesAsync()
        {
            return await _context.Categories.ToListAsync();
        }

        //GET BY ID
        public async Task<Models.Entities.Categories?> GetCategoryByIdAsync(Guid categoryId)
        {
            return await _context.Categories.FirstOrDefaultAsync(c => c.CategoryId == categoryId);
        }

        //CREATE
        public async Task<Models.Entities.Categories> CreateCategoryAsync(Models.Dto.CategoriesDto category)
        {
            var categoryEntity = new Models.Entities.Categories
            {
                CategoryId = Guid.NewGuid(),
                Name = category.Name,
            };
            _context.Categories.Add(categoryEntity);
            await _context.SaveChangesAsync();
            return categoryEntity;
        }

        //UPDATE

        public async Task<Categories?> UpdateCategoryAsync(Guid categoryId, CategoriesDto updatedCategory)
        {
            var existingCategory = await _context.Categories
                .FirstOrDefaultAsync(c => c.CategoryId == categoryId);

            if (existingCategory == null)
                return null;

            existingCategory.Name = updatedCategory.Name;

            await _context.SaveChangesAsync();

            return existingCategory;
        }


        //DELETE

        public async Task<bool> DeleteCategoryAsync(Guid categoryId)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.CategoryId == categoryId);
            if (category == null)
            {
                return false;
            }
            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return true;
        }

        //ADD Car to Category
        public async Task<CategoriesDto?> AddCarToCategory(Guid carId, Guid categoryId)
        {
            var category = await _context.Categories
                .Include(c => c.Cars)
                .FirstOrDefaultAsync(c => c.CategoryId == categoryId);

            if (category == null)
                return null;

            var car = await _context.Cars
                .FirstOrDefaultAsync(c => c.CarId == carId);

            if (car == null)
                return null;

            if (!category.Cars.Any(c => c.CarId == carId))
            {
                category.Cars.Add(car);
                await _context.SaveChangesAsync();
            }

            return new CategoriesDto
            {
                CategoryId = category.CategoryId,
                Name = category.Name,
                Cars = category.Cars.Select(c => new CarsDto
                {
                    Make = c.Make,
                    Model = c.Model
                }).ToList()
            };
        }


    }
}
