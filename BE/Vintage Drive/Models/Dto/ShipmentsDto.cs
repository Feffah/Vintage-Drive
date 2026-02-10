namespace Vintage_Drive.Models.Dto
{
    public class ShipmentsDto
    {
        public string ShipmentType { get; set; }    // Tipo di spedizione (es. Standard, Espresso, Ritiro in negozio)
        public decimal Cost { get; set; }           // Costo della spedizione
        public DateTime ShipmentDate { get; set; }  // Data in cui la spedizione è stata effettuata

        public DateTime ShippingDate { get; set; }  // Data di spedizione prevista

        public string TrackingNumber { get; set; }   // Numero di tracciamento della spedizione

        public string ShippingAddress { get; set; }   // Indirizzo di spedizione

        public string ShippingCity { get; set; }       // Città di spedizione

        public string ShippingPostalCode { get; set; } // CAP di spedizione

        public string ShippingCountry { get; set; }    // Paese di spedizione

        public string ShipmentStatus { get; set; }    // Stato della spedizione (es. In transito, Consegnato, Ritirato)
    }
}
