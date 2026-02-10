using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Vintage_Drive.Models.Entities
{
    public class Orders
    {
        [Key]
        public Guid OrderId { get; set; }
        public string UserId { get; set; }
        public Users Users { get; set; }

        // One-to-one: Order -> Payment
        public Guid? PaymentId { get; set; }
        public Payments? Payments { get; set; }

        // One-to-many: Order -> Shipment
        public Guid? ShipmentId { get; set; }
        public Shipments? Shipments { get; set; }

        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string OrderStatus { get; set; }

        // One-to-many: Order -> Cars
        public ICollection<Cars> Cars { get; set; } = new List<Cars>();
    }
}
