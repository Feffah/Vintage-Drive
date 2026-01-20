using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Vintage_Drive.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShipmentsController : ControllerBase
    {
        private readonly Services.ShipmentsService _shipmentsService;
        public ShipmentsController(Services.ShipmentsService shipmentsService)
        {
            _shipmentsService = shipmentsService;
        }

        //GET ALL

        [HttpGet]

        public async Task<IActionResult> GetAllShipments()
        {
            var shipments = await _shipmentsService.GetAllShipmentsAsync();
            return Ok(shipments);
        }

        //GET BY ID

        [HttpGet("{id}")]

        public async Task<IActionResult> GetShipmentById(Guid id)
        {
            var shipment = await _shipmentsService.GetShipmentByIdAsync(id);
            if (shipment == null)
            {
                return NotFound();
            }
            return Ok(shipment);
        }

        //CREATE

        [HttpPost]

        public async Task<IActionResult> CreateShipment(Models.Entities.Shipments shipment)
        {
            var createdShipment = await _shipmentsService.CreateShipmentAsync(shipment);
            return CreatedAtAction(nameof(GetShipmentById), new { id = createdShipment.ShipmentId }, createdShipment);
        }

        //UPDATE

        [HttpPut("{id}")]

        public async Task<IActionResult> UpdateShipment(Guid id, Models.Entities.Shipments updatedShipment)
        {
            var shipment = await _shipmentsService.UpdateShipmentAsync(id, updatedShipment);
            if (shipment == null)
            {
                return NotFound();
            }
            return Ok(shipment);
        }

        //DELETE

        [HttpDelete("{id}")]

        public async Task<IActionResult> DeleteShipment(Guid id)
        {
            var result = await _shipmentsService.DeleteShipmentAsync(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
    }
