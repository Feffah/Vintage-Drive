using System;
using System.ComponentModel.DataAnnotations;

namespace Vintage_Drive.Models.Entities
{
    public class Payments
    {
        [Key]
        public Guid PaymentId { get; set; }
        public string PaymentType { get; set; }
        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; }

        // FK esplicita per relazione uno-a-uno
        public Guid OrderId { get; set; }
        public Orders Orders { get; set; }
    }
}
