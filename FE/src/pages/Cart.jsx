import './Products.css';

export default function Cart({ cart, onRemove, onChangeQuantity, onCheckout }) {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return (
        <div className="products-container">
            <h2>Your Cart</h2>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className="products-list">
                    {cart.map((car, idx) => (
                        <div className="product-card" key={idx}>
                            <img src={car.image} alt={car.name} />
                            <h3>{car.name}</h3>
                            <p>${car.price.toLocaleString()}</p>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', margin: '0.5rem 0' }}>
                                <button onClick={() => onChangeQuantity(idx, -1)} disabled={car.quantity <= 1}>-</button>
                                <span style={{ minWidth: 24, textAlign: 'center' }}>{car.quantity}</span>
                                <button onClick={() => onChangeQuantity(idx, 1)}>+</button>
                            </div>
                            <button onClick={() => onRemove(idx)}>Remove</button>
                        </div>
                    ))}
                </div>
            )}
            <div style={{ marginTop: '2rem', textAlign: 'center', color: '#b48a78', fontWeight: 'bold' }}>
                Total: ${total.toLocaleString()}
            </div>
            {cart.length > 0 && (
                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <button style={{ background: '#b48a78', color: '#fff', border: 'none', borderRadius: 8, padding: '0.7rem 2rem', fontWeight: 'bold', fontSize: '1.1rem' }} onClick={onCheckout}>
                        Checkout
                    </button>
                </div>
            )}
        </div>
    );
}
