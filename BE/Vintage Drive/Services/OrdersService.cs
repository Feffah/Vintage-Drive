using Vintage_Drive.Data;
using Microsoft.EntityFrameworkCore;
namespace Vintage_Drive.Services
{
    public class OrdersService
    {
        private readonly ApplicationDbContext _context;
        public OrdersService(ApplicationDbContext context)
        {
            _context = context;
        }
        //GET ALL
        public async Task<List<Models.Entities.Orders>> GetAllOrdersAsync()
        {
            return await _context.Orders.ToListAsync();
        }
        //GET BY ID
        public async Task<Models.Entities.Orders?> GetOrderByIdAsync(Guid orderId)
        {
            return await _context.Orders.FirstOrDefaultAsync(o => o.OrderId == orderId);
        }
        //CREATE
        public async Task<Models.Entities.Orders> CreateOrderAsync(Models.Entities.Orders order)
        {
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            return order;
        }
        //UPDATE
        public async Task<Models.Entities.Orders?> UpdateOrderAsync(Guid orderId, Models.Entities.Orders updatedOrder)
        {
            var existingOrder = await _context.Orders.FirstOrDefaultAsync(o => o.OrderId == orderId);
            if (existingOrder == null)
            {
                return null;
            }
            // Aggiorna le proprietà dell'ordine esistente
            _context.Entry(existingOrder).CurrentValues.SetValues(updatedOrder);
            await _context.SaveChangesAsync();
            return existingOrder;
        }
        //DELETE
        public async Task<bool> DeleteOrderAsync(Guid orderId)
        {
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.OrderId == orderId);
            if (order == null)
            {
                return false;
            }
            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
