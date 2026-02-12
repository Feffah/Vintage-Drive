import { useState, useEffect } from 'react';
import './Orders.css';
import { getOrders, getOrderById } from "../../services/apiService";
import { checkLogin } from "../../services/loginService";
import { useNavigate } from "react-router-dom";

export default function Orders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLogged, setLogged] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const checkLogged = () => {
            setLogged(checkLogin());
            if (!checkLogin()) {
                navigate("/login");
            }
        }
        checkLogged();
        if (checkLogin()) {
            fetchOrders();
        }
    }, [navigate]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const ordersRes = await getOrders();
            setOrders(ordersRes || []);
        } catch (err) {
            setError("Errore nel caricamento ordini");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = async (orderId) => {
        try {
            const orderDetails = await getOrderById(orderId);
            setSelectedOrder(orderDetails);
        } catch (err) {
            setError("Errore nel caricamento dettagli ordine");
            console.error(err);
        }
    };

    const handleCloseDetails = () => {
        setSelectedOrder(null);
    };

    if (!isLogged) {
        return (
            <div className="products-container">
                <p>Effettua il login per visualizzare i tuoi ordini.</p>
            </div>
        );
    }

    if (loading) return <div className="products-container"><p>Caricamento ordini...</p></div>;

    return (
        <div className="products-container">
            <h2>I miei Ordini</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {selectedOrder && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: '#fff',
                        padding: '2rem',
                        borderRadius: '8px',
                        maxWidth: '600px',
                        maxHeight: '80vh',
                        overflow: 'auto',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ color: '#b48a78' }}>Ordine #{selectedOrder.orderId}</h3>
                            <button
                                onClick={handleCloseDetails}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    padding: 0
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                            <p><strong>Data Ordine:</strong> {new Date(selectedOrder.orderDate).toLocaleDateString('it-IT')}</p>
                            <p><strong>Stato:</strong> <span style={{ color: '#b48a78', fontWeight: 'bold' }}>{selectedOrder.status || 'In attesa'}</span></p>
                            <p><strong>Totale:</strong> <span style={{ fontSize: '1.1em', color: '#b48a78', fontWeight: 'bold' }}>${selectedOrder.totalAmount?.toLocaleString() || '0'}</span></p>
                            <p><strong>Descrizione:</strong> {selectedOrder.description || 'Nessuna descrizione'}</p>
                        </div>

                        <button
                            className="cardButton"
                            onClick={handleCloseDetails}
                            style={{ width: '100%', background: '#b48a78' }}
                        >
                            Chiudi
                        </button>
                    </div>
                </div>
            )}

            {orders.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {orders.map(order => (
                        <div className="product-card" key={order.orderId} style={{ cursor: 'pointer' }}>
                            <h3 style={{ color: '#b48a78' }}>Ordine #{order.orderId}</h3>
                            <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                                <p><strong>Data:</strong> {new Date(order.orderDate).toLocaleDateString('it-IT')}</p>
                                <p><strong>Stato:</strong> <span style={{ color: '#b48a78', fontWeight: 'bold' }}>{order.status || 'In attesa'}</span></p>
                                <p><strong>Importo:</strong> <span style={{ fontSize: '1.1em', color: '#b48a78', fontWeight: 'bold' }}>${order.totalAmount?.toLocaleString() || '0'}</span></p>
                            </div>
                            <button
                                className="cardButton"
                                onClick={() => handleViewDetails(order.orderId)}
                                style={{ width: '100%', background: '#b48a78', color: '#fff' }}
                            >
                                Visualizza Dettagli
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p style={{ textAlign: 'center', marginTop: '2rem', color: '#666' }}>
                    Non hai ancora effettuato ordini. <a href="/products" style={{ color: '#b48a78', textDecoration: 'none', fontWeight: 'bold' }}>Continua lo shopping</a>
                </p>
            )}
        </div>
    );
}
