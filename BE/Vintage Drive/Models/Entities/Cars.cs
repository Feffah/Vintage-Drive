using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Vintage_Drive.Models.Entities
{
    public class Cars
    {
        [Key]
        public Guid CarId { get; set; }

        public string Make { get; set; }
        public string Model { get; set; }
        public string Version { get; set; }
        public int Year { get; set; }
        public string VIN { get; set; }
        public string LicensePlate { get; set; }
        public string EngineType { get; set; }
        public int EngineDisplacement { get; set; }
        public int HorsePower { get; set; }
        public int? Torque { get; set; }
        public string Transmission { get; set; }
        public int? Gears { get; set; }
        public string ExteriorColor { get; set; }
        public string InteriorColor { get; set; }
        public string InteriorMaterial { get; set; }
        public int Mileage { get; set; }
        public string FuelType { get; set; }
        public double? FuelConsumption { get; set; }
        public string BodyStyle { get; set; }
        public int OwnersCount { get; set; }
        public bool HasOriginalDocuments { get; set; }
        public string Condition { get; set; }
        public bool IsAsiCertified { get; set; }
        public DateTime? CertificationDate { get; set; }
        public bool IsRoadLegal { get; set; }
        public DateTime? LastInspectionDate { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string CarStatus { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime? PublishedAt { get; set; }
        public bool IsVisible { get; set; }

        // Many-to-many: Cars - Categories
        public ICollection<Categories>? Categories { get; set; } = new List<Categories>();

        // One-to-many: Car -> Shipment
        public Guid? ShipmentId { get; set; }
        public Shipments? Shipments { get; set; }

        // One-to-many: Car -> Order
        public Guid? OrderId { get; set; }
        public Orders? Orders { get; set; }
        // One-to-many: Car -> CarImage
        public ICollection<CarImage> Images { get; set; } = new List<CarImage>();

    }
}
