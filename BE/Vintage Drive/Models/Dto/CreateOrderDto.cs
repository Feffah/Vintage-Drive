namespace Vintage_Drive.Models.Dto
{
    public class CreateOrderDto
    {
        public string UserId { get; set; }

        // Dati pagamento
        public PaymentsDto Payment { get; set; }

        // Dati spedizione
        public ShipmentsDto Shipment { get; set; }

        // Auto da associare
        public List<Guid> CarIds { get; set; } = new List<Guid>();

        public decimal TotalAmount { get; set; }
        public string OrderStatus { get; set; }
    }

}
