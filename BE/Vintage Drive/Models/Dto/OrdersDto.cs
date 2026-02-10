namespace Vintage_Drive.Models.Dto
{
    public class OrdersDto
    {
        public Guid OrderId { get; set; }         // Identificativo univoco dell'ordine
        public Guid UserId { get; set; }          // Identificativo dell'utente che ha effettuato l'ordine
        public Guid PaymentId { get; set; }       // Identificativo del pagamento associato all'ordine
        public Guid ShipmentId { get; set; }      // Identificativo della spedizione associata all'ordine
        public DateTime OrderDate { get; set; }   // Data in cui l'ordine è stato effettuato
        public decimal TotalAmount { get; set; }  // Importo totale dell'ordine

        public string OrderStatus { get; set; }   // Stato dell'ordine (es. In elaborazione, Spedito, Consegnato, Annullato)

        public List<Guid> CarId = new List<Guid>(); // Identificativo dell'auto ordinata
    }
}
