export default function ProductsDetails({ onAddToCart, car }) {
    return (
        <div>
            <h2>Dettagli del Prodotto</h2>
            <p>Qui puoi visualizzare i dettagli del prodotto selezionato.</p>
            <button onClick={() => onAddToCart(car)}>Aggiungi al carrello</button>

        </div>
    );
}
