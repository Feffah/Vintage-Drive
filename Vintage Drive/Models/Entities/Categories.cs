using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Vintage_Drive.Models.Entities
{
    public class Categories
    {
        [Key]
        public Guid CategoryId { get; set; }
        public string Name { get; set; }

        // Many-to-many: Categories - Cars
        public ICollection<Cars>? Cars { get; set; } = new List<Cars>();
    }
}
