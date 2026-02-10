using Vintage_Drive.Data;
using Microsoft.EntityFrameworkCore;
namespace Vintage_Drive.Services
{
    public class PaymentsService
    {
        private readonly ApplicationDbContext _context;
        public PaymentsService(ApplicationDbContext context)
        {
            _context = context;
        }
        //GET ALL
        public async Task<List<Models.Entities.Payments>> GetAllPaymentsAsync()
        {
            return await _context.Payments.ToListAsync();
        }

        //GET BY ID

        public async Task<Models.Entities.Payments?> GetPaymentByIdAsync(Guid paymentId)
        {
            return await _context.Payments.FirstOrDefaultAsync(p => p.PaymentId == paymentId);
        }

        //CREATE

        public async Task<Models.Entities.Payments> CreatePaymentAsync(Models.Entities.Payments payment)
        {
            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();
            return payment;
        }

        //UPDATE

        public async Task<Models.Entities.Payments?> UpdatePaymentAsync(Guid paymentId, Models.Entities.Payments updatedPayment)
        {
            var existingPayment = await _context.Payments.FirstOrDefaultAsync(p => p.PaymentId == paymentId);
            if (existingPayment == null)
            {
                return null;
            }
            // Aggiorna le proprietà del pagamento esistente
            _context.Entry(existingPayment).CurrentValues.SetValues(updatedPayment);
            await _context.SaveChangesAsync();
            return existingPayment;
        }

        //DELETE

        public async Task<bool> DeletePaymentAsync(Guid paymentId)
        {
            var payment = await _context.Payments.FirstOrDefaultAsync(p => p.PaymentId == paymentId);
            if (payment == null)
            {
                return false;
            }
            _context.Payments.Remove(payment);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
