using Vintage_Drive.Data;
using Microsoft.EntityFrameworkCore;
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

        public async Task<Models.Entities.Categories?> UpdateCategoryAsync(Guid categoryId, Models.Dto.CategoriesDto updatedCategory)
        {
            var existingCategory = await _context.Categories.FirstOrDefaultAsync(c => c.CategoryId == categoryId);
            if (existingCategory == null)
            {
                return null;
            }
            // Aggiorna le proprietà della categoria esistente
            _context.Entry(existingCategory).CurrentValues.SetValues(updatedCategory);
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
    }
}
