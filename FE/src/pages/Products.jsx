import './Products.css';
import { Link } from 'react-router-dom'

const products = [
    { id: 1, name: 'Vintage Mustang', price: 35000, image: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=400&q=80' },
    { id: 2, name: 'Classic Beetle', price: 18000, image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80' },
    { id: 3, name: 'Retro Mini Cooper', price: 22000, image: 'https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=crop&w=400&q=80' },
];

export default function Products({ onAddToCart, onNavigate }) {
    return (
        <div className="products-container">
            <h2>Vintage Cars</h2>
            <div className="products-list">
                {products.map(car => (
                    <div className="product-card" key={car.id}>
                        <img src={car.image} alt={car.name} />
                        <h3>{car.name}</h3>
                        <p>${car.price.toLocaleString()}</p>
                        <button onClick={() => onAddToCart(car)}>Aggiungi al carrello</button>
                        <Link to={`/details/${car.id}`}>
                            <button>Visualizza dettagli</button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
