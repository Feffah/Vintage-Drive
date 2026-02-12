import { useState } from 'react';
import './Checkout.css';
import { createOrder, getUserById } from "../../services/apiService";
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';

export default function Checkout({ cart, onCheckout }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Opzioni di spedizione
    const shippingOptions = [
        { type: 'Standard', cost: 10, days: '5-7' },
        { type: 'Express', cost: 25, days: '2-3' },
        { type: 'Overnight', cost: 50, days: '1' }
    ];

    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        shippingAddress: '',
        shippingCity: '',
        shippingPostalCode: '',
        shippingCountry: 'Italy',
        shipmentType: 'Standard',
        cardNumber: '',
        cardExpiry: '',
        cardCVV: '',
    });
    const [orderCompleted, setOrderCompleted] = useState(false);

    // Precompila i campi con i dati dell'utente
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        const loadUserData = async () => {
            try {
                const userData = await getUserById(userId);
                setFormData(prev => ({
                    ...prev,
                    customerName: `${userData.name || ''} ${userData.surname || ''}`.trim(),
                    customerEmail: userData.email || '',
                    customerPhone: userData.phone || '',
                    shippingAddress: userData.adress || '',
                    shippingCity: userData.city || '',
                    shippingPostalCode: userData.postalCode || '',
                    shippingCountry: userData.country || 'Italy',
                }));
            } catch (err) {
                console.error('Errore nel caricamento dati utente:', err);
            }
        };

        loadUserData();
    }, []);

    const selectedShipping = shippingOptions.find(opt => opt.type === formData.shipmentType);
    const shippingCost = selectedShipping?.cost || 0;
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const grandTotal = total + shippingCost;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.customerName || !formData.customerEmail || !formData.customerPhone) {
            setError('Completa tutti i campi personali');
            return false;
        }
        if (!formData.shippingAddress || !formData.shippingCity || !formData.shippingPostalCode || !formData.shippingCountry) {
            setError('Completa tutti i campi di spedizione');
            return false;
        }
        if (!formData.cardNumber || !formData.cardExpiry || !formData.cardCVV) {
            setError('Completa tutti i dati della carta');
            return false;
        }
        if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
            setError('Numero carta invalido');
            return false;
        }
        if (cart.length === 0) {
            setError('Il carrello è vuoto');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const userId = localStorage.getItem("userId");
            const now = new Date().toISOString();

            const deliveryDays = parseInt(selectedShipping?.days.split('-')[0]) || 5;
            const shippingDate = new Date();
            shippingDate.setDate(shippingDate.getDate() + deliveryDays);

            const trackingNumber = `VDS-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

            const payment = {
                paymentId: undefined,
                paymentType: 'Credit Card',
                amount: total,
                paymentDate: now
            };

            const shipment = {
                shipmentType: formData.shipmentType,
                cost: shippingCost,
                shipmentDate: now,
                shippingDate: shippingDate.toISOString(),
                trackingNumber: trackingNumber,
                shippingAddress: formData.shippingAddress,
                shippingCity: formData.shippingCity,
                shippingPostalCode: formData.shippingPostalCode,
                shippingCountry: formData.shippingCountry,
                shipmentStatus: 'Pending'
            };

            const carIds = cart.map(item => item.carId || item.id);

            const createOrderDto = {
                userId: userId,
                payment: payment,
                shipment: shipment,
                carIds: carIds,
                totalAmount: grandTotal,
                orderStatus: 'Pending'
            };

            const orderResponse = await createOrder(createOrderDto);
            const orderId = orderResponse.orderId || orderResponse.id;

            if (!orderId) {
                throw new Error('Errore: impossibile creare l\'ordine');
            }

            setOrderCompleted(true);
            onCheckout();

            setTimeout(() => {
                navigate('/orders');
            }, 3000);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Errore nel processare il pagamento. Riprova.');
        } finally {
            setLoading(false);
        }
    };

    if (orderCompleted) {
        return (
            <div className="checkout-container">
                <div className="checkout-success">
                    <div className="success-icon">✓</div>
                    <h2 className="success-title">Ordine completato!</h2>
                    <p className="success-message">
                        Grazie per l'acquisto. Ti stiamo reindirizzando ai tuoi ordini...
                    </p>
                    <p>
                        Se non vieni reindirizzato automaticamente, <a href="/orders" className="redirect-link">clicca qui</a>.
                    </p>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="products-container">
                <p>Il carrello è vuoto. <a href="/products" style={{ color: '#b48a78', fontWeight: 'bold' }}>Continua lo shopping</a></p>
            </div>
        );
    }

    return (
        <div className="products-container">
            <h2>Checkout</h2>
            {error && <p style={{ color: 'red', padding: '1rem', background: '#ffe6e6', borderRadius: '4px', marginBottom: '1rem' }}>{error}</p>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div>
                    <h3 style={{ color: '#b48a78', marginBottom: '1rem' }}>Riepilogo Ordine</h3>
                    <div style={{ background: '#f5f5f5', padding: '1.5rem', borderRadius: '8px' }}>
                        {cart.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #ddd' }}>
                                <div>
                                    <p style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{item.make} {item.model}</p>
                                    <p style={{ color: '#666', fontSize: '0.9rem' }}>Quantità: {item.quantity}</p>
                                </div>
                                <p style={{ fontWeight: 'bold', color: '#b48a78' }}>${(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                        ))}
                        
                        <div style={{ borderTop: '2px solid #b48a78', paddingTop: '1rem', marginTop: '1rem', marginBottom: '1rem' }}>
                            <p style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', color: '#666' }}>
                                <span>Subtotale:</span>
                                <span>${total.toLocaleString()}</span>
                            </p>
                        </div>

                        <div style={{ background: '#fff9e6', padding: '1rem', borderRadius: '4px', marginBottom: '1rem', border: '1px solid #ffe66d' }}>
                            <p style={{ fontWeight: 'bold', color: '#333', marginBottom: '0.5rem' }}>Spedizione: {formData.shipmentType}</p>
                            <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>Consegna in {selectedShipping?.days} giorni</p>
                        </div>

                        <p style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', color: '#666', marginBottom: '1rem' }}>
                            <span>Costo Spedizione:</span>
                            <span>${shippingCost.toLocaleString()}</span>
                        </p>

                        <div style={{ borderTop: '2px solid #b48a78', paddingTop: '1rem' }}>
                            <p style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 'bold', color: '#b48a78' }}>
                                <span>Totale:</span>
                                <span>${grandTotal.toLocaleString()}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 style={{ color: '#b48a78', marginBottom: '1rem' }}>Dati di Pagamento e Spedizione</h3>
                    <form onSubmit={handleSubmit}>
                        <h4 style={{ color: '#666', marginTop: '1.5rem', marginBottom: '1rem', fontSize: '1rem' }}>Dati Personali</h4>
                        
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#333' }}>Nome Completo</label>
                            <input
                                type="text"
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleInputChange}
                                placeholder="Mario Rossi"
                                required
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' }}
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#333' }}>Email</label>
                            <input
                                type="email"
                                name="customerEmail"
                                value={formData.customerEmail}
                                onChange={handleInputChange}
                                placeholder="mario@example.com"
                                required
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' }}
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#333' }}>Telefono</label>
                            <input
                                type="tel"
                                name="customerPhone"
                                value={formData.customerPhone}
                                onChange={handleInputChange}
                                placeholder="+39 123 456 7890"
                                required
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' }}
                            />
                        </div>

                        <h4 style={{ color: '#666', marginTop: '1.5rem', marginBottom: '1rem', fontSize: '1rem' }}>Indirizzo di Spedizione</h4>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#333' }}>Indirizzo</label>
                            <input
                                type="text"
                                name="shippingAddress"
                                value={formData.shippingAddress}
                                onChange={handleInputChange}
                                placeholder="Via Roma 10"
                                required
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' }}
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#333' }}>Città</label>
                            <input
                                type="text"
                                name="shippingCity"
                                value={formData.shippingCity}
                                onChange={handleInputChange}
                                placeholder="Roma"
                                required
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#333' }}>CAP</label>
                                <input
                                    type="text"
                                    name="shippingPostalCode"
                                    value={formData.shippingPostalCode}
                                    onChange={handleInputChange}
                                    placeholder="00100"
                                    required
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#333' }}>Paese</label>
                                <input
                                    type="text"
                                    name="shippingCountry"
                                    value={formData.shippingCountry}
                                    onChange={handleInputChange}
                                    placeholder="Italy"
                                    required
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' }}
                                />
                            </div>
                        </div>

                        <h4 style={{ color: '#666', marginTop: '1.5rem', marginBottom: '1rem', fontSize: '1rem' }}>Spedizione</h4>

                        <div style={{ marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                            {shippingOptions.map(option => (
                                <label key={option.type} style={{ display: 'flex', alignItems: 'center', padding: '0.75rem', border: `2px solid ${formData.shipmentType === option.type ? '#b48a78' : '#ddd'}`, borderRadius: '4px', cursor: 'pointer', background: formData.shipmentType === option.type ? '#faf5f0' : '#fff' }}>
                                    <input
                                        type="radio"
                                        name="shipmentType"
                                        value={option.type}
                                        checked={formData.shipmentType === option.type}
                                        onChange={handleInputChange}
                                        style={{ marginRight: '0.75rem', cursor: 'pointer' }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: 'bold', marginBottom: '0.25rem', color: '#333' }}>{option.type}</p>
                                        <p style={{ color: '#666', fontSize: '0.85rem', margin: 0 }}>Consegna in {option.days} giorni</p>
                                    </div>
                                    <p style={{ fontWeight: 'bold', color: '#b48a78', marginLeft: '1rem' }}>${option.cost}</p>
                                </label>
                            ))}
                        </div>

                        <h4 style={{ color: '#666', marginTop: '1.5rem', marginBottom: '1rem', fontSize: '1rem' }}>Dati Carta</h4>

                        <div style={{ background: '#fff3cd', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem', border: '1px solid #ffc107' }}>
                            <p style={{ color: '#856404', marginBottom: '0.5rem', fontWeight: 'bold' }}>Dati Carta Test</p>
                            <p style={{ color: '#856404', fontSize: '0.9rem', margin: 0 }}>Numero: 4532 1234 5678 9001 | Scad: 12/25 | CVV: 123</p>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#333' }}>Numero Carta</label>
                            <input
                                type="text"
                                name="cardNumber"
                                value={formData.cardNumber}
                                onChange={(e) => {
                                    let value = e.target.value.replace(/\s/g, '');
                                    value = value.replace(/(\d{4})/g, '$1 ').trim();
                                    setFormData(prev => ({ ...prev, cardNumber: value }));
                                }}
                                placeholder="1234 5678 9012 3456"
                                maxLength="19"
                                required
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#333' }}>Scadenza</label>
                                <input
                                    type="text"
                                    name="cardExpiry"
                                    value={formData.cardExpiry}
                                    onChange={(e) => {
                                        let value = e.target.value.replace(/\D/g, '');
                                        if (value.length >= 2) {
                                            value = value.slice(0, 2) + '/' + value.slice(2, 4);
                                        }
                                        setFormData(prev => ({ ...prev, cardExpiry: value }));
                                    }}
                                    placeholder="MM/YY"
                                    maxLength="5"
                                    required
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#333' }}>CVV</label>
                                <input
                                    type="text"
                                    name="cardCVV"
                                    value={formData.cardCVV}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '').slice(0, 3);
                                        setFormData(prev => ({ ...prev, cardCVV: value }));
                                    }}
                                    placeholder="123"
                                    maxLength="3"
                                    required
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' }}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: loading ? '#ccc' : '#b48a78',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? 'Elaborazione in corso...' : `Paga ${grandTotal.toLocaleString()}`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );

    if (orderCompleted) {
        return (
            <div className="products-container">
                <div style={{
                    textAlign: 'center',
                    padding: '3rem',
                    background: '#f0f8f0',
                    borderRadius: '8px',
                    maxWidth: '500px',
                    margin: '2rem auto'
                }}>
                    <h2 style={{ color: '#4CAF50', marginBottom: '1rem' }}>Ordine completato!</h2>
                    <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>
                        Grazie per l'acquisto. Ti stiamo reindirizzando ai tuoi ordini...
                    </p>
                    <p style={{ color: '#999', fontSize: '0.9rem' }}>
                        Se non vieni reindirizzato automaticamente, <a href="/orders" style={{ color: '#b48a78', fontWeight: 'bold' }}>clicca qui</a>.
                    </p>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="products-container">
                <p>Il carrello è vuoto. <a href="/products" style={{ color: '#b48a78', fontWeight: 'bold' }}>Continua lo shopping</a></p>
            </div>
        );
    }

    return (
        <div className="products-container">
            <h2>Checkout</h2>
            {error && <p style={{ color: 'red', padding: '1rem', background: '#ffe6e6', borderRadius: '4px', marginBottom: '1rem' }}>{error}</p>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div>
                    <h3 style={{ color: '#b48a78', marginBottom: '1rem' }}>Riepilogo Ordine</h3>
                    <div style={{ background: '#f5f5f5', padding: '1.5rem', borderRadius: '8px' }}>
                        {cart.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #ddd' }}>
                                <div>
                                    <p style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{item.make} {item.model}</p>
                                    <p style={{ color: '#666', fontSize: '0.9rem' }}>Quantità: {item.quantity}</p>
                                </div>
                                <p style={{ fontWeight: 'bold', color: '#b48a78' }}>${(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                        ))}
                        <div style={{ borderTop: '2px solid #b48a78', paddingTop: '1rem', marginTop: '1rem' }}>
                            <p style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 'bold', color: '#b48a78' }}>
                                <span>Totale:</span>
                                <span>${total.toLocaleString()}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 style={{ color: '#b48a78', marginBottom: '1rem' }}>Dati di Pagamento</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#333' }}>Nome Completo</label>
                            <input
                                type="text"
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleInputChange}
                                placeholder="Mario Rossi"
                                required
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' }}
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#333' }}>Email</label>
                            <input
                                type="email"
                                name="customerEmail"
                                value={formData.customerEmail}
                                onChange={handleInputChange}
                                placeholder="mario@example.com"
                                required
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' }}
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#333' }}>Telefono</label>
                            <input
                                type="tel"
                                name="customerPhone"
                                value={formData.customerPhone}
                                onChange={handleInputChange}
                                placeholder="+39 123 456 7890"
                                required
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' }}
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#333' }}>Indirizzo di Spedizione</label>
                            <textarea
                                name="shippingAddress"
                                value={formData.shippingAddress}
                                onChange={handleInputChange}
                                placeholder="Via Roma 10, 00100 Roma (RM)"
                                required
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', minHeight: '80px' }}
                            />
                        </div>

                        <div style={{ background: '#fff3cd', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem', border: '1px solid #ffc107' }}>
                            <p style={{ color: '#856404', marginBottom: '0.5rem', fontWeight: 'bold' }}>ℹ Dati Carta Test</p>
                            <p style={{ color: '#856404', fontSize: '0.9rem', margin: 0 }}>Numero: 4532 1234 5678 9001 | Scad: 12/25 | CVV: 123</p>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#333' }}>Numero Carta</label>
                            <input
                                type="text"
                                name="cardNumber"
                                value={formData.cardNumber}
                                onChange={(e) => {
                                    let value = e.target.value.replace(/\s/g, '');
                                    value = value.replace(/(\d{4})/g, '$1 ').trim();
                                    setFormData(prev => ({ ...prev, cardNumber: value }));
                                }}
                                placeholder="1234 5678 9012 3456"
                                maxLength="19"
                                required
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#333' }}>Scadenza</label>
                                <input
                                    type="text"
                                    name="cardExpiry"
                                    value={formData.cardExpiry}
                                    onChange={(e) => {
                                        let value = e.target.value.replace(/\D/g, '');
                                        if (value.length >= 2) {
                                            value = value.slice(0, 2) + '/' + value.slice(2, 4);
                                        }
                                        setFormData(prev => ({ ...prev, cardExpiry: value }));
                                    }}
                                    placeholder="MM/YY"
                                    maxLength="5"
                                    required
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#333' }}>CVV</label>
                                <input
                                    type="text"
                                    name="cardCVV"
                                    value={formData.cardCVV}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '').slice(0, 3);
                                        setFormData(prev => ({ ...prev, cardCVV: value }));
                                    }}
                                    placeholder="123"
                                    maxLength="3"
                                    required
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' }}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: loading ? '#ccc' : '#b48a78',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? 'Elaborazione in corso...' : `Paga ${total.toLocaleString()}`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
