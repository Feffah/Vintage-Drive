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
    public class CarsController : ControllerBase
    {
        private readonly CarsService _carService;
        public CarsController(CarsService carService)
        {
            _carService = carService;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CarsDto>>> GetAllCars()
        {
            var cars = await _carService.GetAllCarsAsync();
            return Ok(cars);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<CarsDto>> GetCarById(Guid id)
        {
            var car = await _carService.GetCarByIdAsync(id);
            if (car == null)
            {
                return NotFound();
            }
            return Ok(car);
        }
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CarsDto>> CreateCar([FromBody] CarsDto carCreateDto)
        {
            var createdCar = await _carService.CreateCarAsync(carCreateDto);
            return CreatedAtAction(nameof(GetCarById), new { id = createdCar.CarId }, createdCar);
        }
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateCar(Guid id, [FromBody] CarsDto carUpdateDto)
        {
            var result = await _carService.UpdateCarAsync(id, carUpdateDto);
            if (result == null)
            {
                return NotFound();
            }
            return NoContent();
        }
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCar(Guid id)
        {
            var result = await _carService.DeleteCarAsync(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}
