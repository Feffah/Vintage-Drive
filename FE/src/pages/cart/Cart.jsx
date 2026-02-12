import './Cart.css';
import { useNavigate } from 'react-router-dom';

export default function Cart({ cart, onRemove, onChangeQuantity, onCheckout }) {
    const navigate = useNavigate();
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    const handleCheckout = () => {
        if (cart.length === 0) {
            alert('Il carrello è vuoto');
            return;
        }
        navigate('/checkout');
    };

    return (
        <div className="products-container">
            <h2>Carrello</h2>
            {cart.length === 0 ? (
                <p>Il tuo carrello è vuoto. <a href="/products" style={{ color: '#b48a78', fontWeight: 'bold' }}>Continua lo shopping</a></p>
            ) : (
                <div className="products-list">
                    {cart.map((car, idx) => (
                        <div className="product-card" key={idx}>
                            {car.image && <img src={car.image} alt={car.make}  style={{ maxHeight: '200px', objectFit: 'cover' }} />}
                            <h3>{car.make || car.name}</h3>
                            <p>{car.model || ''}</p>
                            <p style={{ color: '#b48a78', fontWeight: 'bold', fontSize: '1.1rem' }}>${car.price.toLocaleString()}</p>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', margin: '0.5rem 0' }}>
                                <button className="cardButton" onClick={() => onChangeQuantity(idx, -1)} disabled={car.quantity <= 1}>-</button>
                                <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 'bold' }}>{car.quantity}</span>
                                <button className="cardButton" onClick={() => onChangeQuantity(idx, 1)}>+</button>
                            </div>
                            <p style={{ color: '#666', fontSize: '0.9rem' }}>Subtotale: ${(car.price * car.quantity).toLocaleString()}</p>
                            <button className="cardButton" onClick={() => onRemove(idx)} style={{ background: '#f44336', color: '#fff', width: '100%' }}>Rimuovi</button>
                        </div>
                    ))}
                </div>
            )}
            {cart.length > 0 && (
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <div style={{ color: '#b48a78', fontWeight: 'bold', fontSize: '1.3rem', marginBottom: '1.5rem' }}>
                        Totale: ${total.toLocaleString()}
                    </div>
                    <button 
                        style={{ 
                            background: '#b48a78', 
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: '8px', 
                            padding: '0.7rem 2rem', 
                            fontWeight: 'bold', 
                            fontSize: '1.1rem',
                            cursor: 'pointer'
                        }} 
                        onClick={handleCheckout}
                    >
                        Procedi al Checkout
                    </button>
                </div>
            )}
        </div>
    );
}
