using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Vintage_Drive.Models.Entities
{
    public class Shipments
    {
        [Key]
        public Guid ShipmentId { get; set; }
        public string ShipmentType { get; set; }
        public decimal Cost { get; set; }
        public DateTime ShipmentDate { get; set; }
        public DateTime ShippingDate { get; set; }
        public string TrackingNumber { get; set; }
        public string ShippingAddress { get; set; }
        public string ShippingCity { get; set; }
        public string ShippingPostalCode { get; set; }
        public string ShippingCountry { get; set; }
        public string ShipmentStatus { get; set; }
        public string UserId { get; set; }
        public Users User { get; set; }
        // One-to-many: Shipment -> Cars
        public ICollection<Cars> Cars { get; set; } = new List<Cars>();
    }
}
