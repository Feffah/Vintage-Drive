namespace Vintage_Drive.Models.Dto
{
    public class PaymentsDto
    {
        public Guid PaymentId { get; set; }        // Identificativo univoco del pagamento
        public string PaymentType { get; set; }    // Tipo di pagamento (es. Carta di credito, PayPal, Bonifico bancario)
        public decimal Amount { get; set; }        // Importo del pagamento

        public DateTime PaymentDate { get; set; }  // Data in cui il pagamento è stato effettuato
    }
}
