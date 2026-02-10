using Vintage_Drive.Models.Entities;
using Vintage_Drive.Models.Dto;
using Vintage_Drive.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Vintage_Drive.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly CategoriesService _categoriesService;
        public CategoriesController(CategoriesService categoriesService)
        {
            _categoriesService = categoriesService;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoriesDto>>> GetAllCategories()
        {
            var categories = await _categoriesService.GetAllCategoriesAsync();
            return Ok(categories);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<CategoriesDto>> GetCategoryById(Guid id)
        {
            var category = await _categoriesService.GetCategoryByIdAsync(id);
            if (category == null)
            {
                return NotFound();
            }
            return Ok(category);
        }
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CategoriesDto>> CreateCategory([FromBody] CategoriesDto categoriesCreateDto)
        {
            var createdCategory = await _categoriesService.CreateCategoryAsync(categoriesCreateDto);
            return CreatedAtAction(nameof(GetCategoryById), new { id = createdCategory.CategoryId }, createdCategory);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CategoriesDto>> UpdateCategories(Guid id, [FromBody] CategoriesDto categoriesUpdateDto)
        {
            var updatedCategory = await _categoriesService.UpdateCategoryAsync(id, categoriesUpdateDto);
            if (updatedCategory == null)
            {
                return NotFound();
            }
            return Ok(updatedCategory);
        }

        [HttpDelete("{id}")]

        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCategory(Guid id)
        {
            var result = await _categoriesService.DeleteCategoryAsync(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }

    }
}
