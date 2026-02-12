using Microsoft.EntityFrameworkCore;
using Vintage_Drive.Data;
using Vintage_Drive.Models.Dto;
using Vintage_Drive.Models.Entities;
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
        public async Task<OrdersDto> CreateOrderAsync(CreateOrderDto dto)
        {
            var order = new Orders
            {
                OrderId = Guid.NewGuid(),
                UserId = dto.UserId,
                OrderDate = DateTime.UtcNow,
                TotalAmount = dto.TotalAmount,
                OrderStatus = dto.OrderStatus
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync(); 

            if (dto.Payment != null)
            {
                var payment = new Payments
                {
                    PaymentId = Guid.NewGuid(),
                    PaymentType = dto.Payment.PaymentType,
                    Amount = dto.Payment.Amount,
                    PaymentDate = dto.Payment.PaymentDate,
                    OrderId = order.OrderId
                };
                _context.Payments.Add(payment);

                order.PaymentId = payment.PaymentId;
            }

            if (dto.Shipment != null)
            {
                var shipment = new Shipments
                {
                    ShipmentId = Guid.NewGuid(),
                    ShipmentType = dto.Shipment.ShipmentType,
                    Cost = dto.Shipment.Cost,
                    ShipmentDate = dto.Shipment.ShipmentDate,
                    ShippingDate = dto.Shipment.ShippingDate,
                    TrackingNumber = dto.Shipment.TrackingNumber,
                    ShippingAddress = dto.Shipment.ShippingAddress,
                    ShippingCity = dto.Shipment.ShippingCity,
                    ShippingPostalCode = dto.Shipment.ShippingPostalCode,
                    ShippingCountry = dto.Shipment.ShippingCountry,
                    ShipmentStatus = dto.Shipment.ShipmentStatus,
                    UserId = dto.UserId
                };
                _context.Shipments.Add(shipment);

                order.ShipmentId = shipment.ShipmentId;
            }

            if (dto.CarIds.Any())
            {
                var cars = await _context.Cars
                    .Where(c => dto.CarIds.Contains(c.CarId))
                    .ToListAsync();

                foreach (var car in cars)
                {
                    car.OrderId = order.OrderId;
                    order.Cars.Add(car);
                }
            }

            await _context.SaveChangesAsync();

            return new OrdersDto
            {
                OrderId = order.OrderId,
                UserId = order.UserId,
                PaymentId = (Guid)order.PaymentId,
                ShipmentId = (Guid)order.ShipmentId,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                OrderStatus = order.OrderStatus,
                CarId = order.Cars.Select(c => c.CarId).ToList()
            };
        }


        //UPDATE
        public async Task<OrdersDto?> UpdateOrderAsync(Guid id, OrdersDto dto)
        {
            var order = await _context.Orders
                .Include(o => o.Cars)
                .FirstOrDefaultAsync(o => o.OrderId == id);

            if (order == null) return null;

            order.UserId = dto.UserId.ToString();
            order.PaymentId = dto.PaymentId;
            order.ShipmentId = dto.ShipmentId;
            order.OrderDate = dto.OrderDate;
            order.TotalAmount = dto.TotalAmount;
            order.OrderStatus = dto.OrderStatus;

            var cars = await _context.Cars
                .Where(c => dto.CarId.Contains(c.CarId))
                .ToListAsync();

            order.Cars = cars;

            await _context.SaveChangesAsync();

            return new OrdersDto
            {
                OrderId = order.OrderId,
                UserId = order.UserId,
                PaymentId = order.PaymentId ?? Guid.Empty,
                ShipmentId = order.ShipmentId ?? Guid.Empty,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                OrderStatus = order.OrderStatus,
                CarId = order.Cars.Select(c => c.CarId).ToList()
            };
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
