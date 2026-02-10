namespace Vintage_Drive.Models.Dto
{
    public class CarsDto
    {
        public string Make { get; set; }            // Marca 
        public string Model { get; set; }           // Modello (es. Mustang Shelby)
        public string Version { get; set; }         // Allestimento / serie
        public int Year { get; set; }            // Anno di produzione
        public string VIN { get; set; }             // Numero di telaio
        public string LicensePlate { get; set; }   // Targa
        public string EngineType { get; set; }      //tipologia motore (es. V8)
        public int EngineDisplacement { get; set; } // Cilindrata (cc)
        public int HorsePower { get; set; }         // Cavalli
        public int? Torque { get; set; }            // Coppia (Nm)
        public string Transmission { get; set; } // Manuale, Automatico (enum)
        public int? Gears { get; set; }              // Numero di marce
        public string ExteriorColor { get; set; }           // Colore esterno
        public string InteriorColor { get; set; }           // Colore interno
        public string InteriorMaterial { get; set; } // Pelle, Tessuto, ecc.
        public int Mileage { get; set; } // Chilometraggio
        public string FuelType { get; set; }         // Tipo di carburante
        public double? FuelConsumption { get; set; } // Consumo medio (L/100km)
        public string BodyStyle { get; set; }       // Carrozzeria (es. Coupé, Cabrio)
        public int OwnersCount { get; set; }        // Numero di proprietari precedenti
        public bool HasOriginalDocuments { get; set; } // Documenti originali disponibili
        public string Condition { get; set; }       // Condizioni generali (es. Restaurata, Originale)
        public bool IsAsiCertified { get; set; }        // Certificazione ASI / FIVA
        public DateTime? CertificationDate { get; set; } // Data di certificazione (se applicabile)
        public bool IsRoadLegal { get; set; }        // Omologata per la circolazione stradale
        public DateTime? LastInspectionDate { get; set; } // Data dell'ultima revisione
        public string Description { get; set; }
        public decimal Price { get; set; }          // Prezzo di vendita
        public string CarStatus { get; set; }       // Disponibile, Venduta, In trattativa
        public DateTime CreatedAt { get; set; }       // Data di creazione dell'annuncio
        public DateTime UpdatedAt { get; set; }       // Data di ultimo aggiornamento dell'annuncio
        public DateTime? PublishedAt { get; set; }    // Data di pubblicazione dell'annuncio
        public bool IsVisible { get; set; }         // Visibilità dell'annuncio
    }
}
