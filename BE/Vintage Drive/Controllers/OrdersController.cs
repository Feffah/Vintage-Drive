using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Vintage_Drive.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly Services.OrdersService _ordersService;
        public OrdersController(Services.OrdersService ordersService)
        {
            _ordersService = ordersService;
        }

        //GET ALL

        [HttpGet]

        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _ordersService.GetAllOrdersAsync();
            return Ok(orders);

        }

        //GET BY ID

        [HttpGet("{id}")]

        public async Task<IActionResult> GetOrderById(Guid id)
        {
            var order = await _ordersService.GetOrderByIdAsync(id);
            if (order == null)
            {
                return NotFound();
            }
            return Ok(order);
        }

        //CREATE

        [HttpPost]

        public async Task<IActionResult> CreateOrder(Models.Entities.Orders order)
        {
            var createdOrder = await _ordersService.CreateOrderAsync(order);
            return CreatedAtAction(nameof(GetOrderById), new { id = createdOrder.OrderId }, createdOrder);
        }

        //UPDATE

        [HttpPut("{id}")]

        public async Task<IActionResult> UpdateOrder(Guid id, Models.Entities.Orders updatedOrder)
        {
            var order = await _ordersService.UpdateOrderAsync(id, updatedOrder);
            if (order == null)
            {
                return NotFound();
            }
            return Ok(order);
        }

        //DELETE

        [HttpDelete("{id}")]

        public async Task<IActionResult> DeleteOrder(Guid id)
        {
            var result = await _ordersService.DeleteOrderAsync(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
    }
