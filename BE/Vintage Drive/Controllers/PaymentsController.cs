using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Vintage_Drive.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly Services.PaymentsService _paymentsService;
        public PaymentsController(Services.PaymentsService paymentsService)
        {
            _paymentsService = paymentsService;
        }

        //GET ALL

        [HttpGet]

        public async Task<IActionResult> GetAllPayments()
        {
            var payments = await _paymentsService.GetAllPaymentsAsync();
            return Ok(payments);
        }

        //GET BY ID

        [HttpGet("{id}")]

        public async Task<IActionResult> GetPaymentById(Guid id)
        {
            var payment = await _paymentsService.GetPaymentByIdAsync(id);
            if (payment == null)
            {
                return NotFound();
            }
            return Ok(payment);
        }

        //CREATE

        [HttpPost]

        public async Task<IActionResult> CreatePayment(Models.Entities.Payments payment)
        {
            var createdPayment = await _paymentsService.CreatePaymentAsync(payment);
            return CreatedAtAction(nameof(GetPaymentById), new { id = createdPayment.PaymentId }, createdPayment);
        }

        //UPDATE

        [HttpPut("{id}")]

        public async Task<IActionResult> UpdatePayment(Guid id, Models.Entities.Payments updatedPayment)
        {
            var payment = await _paymentsService.UpdatePaymentAsync(id, updatedPayment);
            if (payment == null)
            {
                return NotFound();
            }
            return Ok(payment);
        }

        //DELETE

        [HttpDelete("{id}")]

        public async Task<IActionResult> DeletePayment(Guid id)
        {
            var result = await _paymentsService.DeletePaymentAsync(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
    }
