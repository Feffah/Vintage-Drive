namespace Vintage_Drive.Models.Dto
{
    public class UpdateOrderDto
    {
        public Guid OrderId { get; set; }
        public string UserId { get; set; }
        public Guid? PaymentId { get; set; }
        public Guid? ShipmentId { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string OrderStatus { get; set; }
        public List<Guid> CarIds { get; set; } = new();
    }

}
