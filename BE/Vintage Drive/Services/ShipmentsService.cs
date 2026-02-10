using Vintage_Drive.Data;
using Microsoft.EntityFrameworkCore;
namespace Vintage_Drive.Services
{
    public class ShipmentsService
    {
        private readonly ApplicationDbContext _context;
        public ShipmentsService(ApplicationDbContext context)
        {
            _context = context;
        }

        //GET ALL
        public async Task<List<Models.Entities.Shipments>> GetAllShipmentsAsync()
        {
            return await _context.Shipments.ToListAsync();
        }

        //GET BY ID

        public async Task<Models.Entities.Shipments?> GetShipmentByIdAsync(Guid shipmentId)
        {
            return await _context.Shipments.FirstOrDefaultAsync(s => s.ShipmentId == shipmentId);
        }

        //CREATE

        public async Task<Models.Entities.Shipments> CreateShipmentAsync(Models.Entities.Shipments shipment)
        {
            _context.Shipments.Add(shipment);
            await _context.SaveChangesAsync();
            return shipment;
        }

        //UPDATE

        public async Task<Models.Entities.Shipments?> UpdateShipmentAsync(Guid shipmentId, Models.Entities.Shipments updatedShipment)
        {
            var existingShipment = await _context.Shipments.FirstOrDefaultAsync(s => s.ShipmentId == shipmentId);
            if (existingShipment == null)
            {
                return null;
            }
            // Aggiorna le proprietà della spedizione esistente
            _context.Entry(existingShipment).CurrentValues.SetValues(updatedShipment);
            await _context.SaveChangesAsync();
            return existingShipment;
        }

        //DELETE

        public async Task<bool> DeleteShipmentAsync(Guid shipmentId)
        {
            var shipment = await _context.Shipments.FirstOrDefaultAsync(s => s.ShipmentId == shipmentId);
            if (shipment == null)
            {
                return false;
            }
            _context.Shipments.Remove(shipment);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
