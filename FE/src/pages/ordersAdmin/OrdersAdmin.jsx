import { useState, useEffect } from 'react';
import './OrdersAdmin.css';
import { getOrders, deleteOrder, getUserById, updateOrder } from '../../services/apiService';
import { useNavigate } from 'react-router-dom';

export default function OrdersAdmin() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedOrderUser, setSelectedOrderUser] = useState(null);
    const [filterStatus, setFilterStatus] = useState('All');
    const [editingStatus, setEditingStatus] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const roles = JSON.parse(localStorage.getItem('roles') || '[]');
    const isAdmin = roles.some(role => role === 'Admin');

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
            return;
        }

        fetchOrders();
    }, [isAdmin, navigate]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const ordersData = await getOrders();
            setOrders(Array.isArray(ordersData) ? ordersData : []);
            setError('');
        } catch (err) {
            console.error(err);
            setError('Errore nel caricamento degli ordini');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm('Sei sicuro di voler eliminare questo ordine?')) {
            try {
                await deleteOrder(orderId);
                setOrders(prev => prev.filter(order => order.orderId !== orderId));
                alert('Ordine eliminato con successo');
                setSelectedOrder(null);
                setSelectedOrderUser(null);
            } catch (err) {
                console.error(err);
                setError('Errore nell\'eliminazione dell\'ordine');
            }
        }
    };

    const handleSelectOrder = async (order) => {
        if (selectedOrder?.orderId === order.orderId) {
            setSelectedOrder(null);
            setSelectedOrderUser(null);
            setEditingStatus(null);
            return;
        }

        setSelectedOrder(order);
        setEditingStatus(order.orderStatus);
        
        try {
            const userData = await getUserById(order.userId);
            setSelectedOrderUser(userData);
        } catch (err) {
            console.error('Errore nel caricamento dati utente:', err);
            setSelectedOrderUser(null);
        }
    };

    const handleStatusChange = (newStatus) => {
        setEditingStatus(newStatus);
    };

    const handleSaveStatus = async () => {
        if (!selectedOrder || !editingStatus) return;

        try {
            setUpdatingStatus(true);
            await updateOrder(selectedOrder.orderId, {
                ...selectedOrder,
                orderStatus: editingStatus
            });

            setOrders(prev => prev.map(order => 
                order.orderId === selectedOrder.orderId 
                    ? { ...order, orderStatus: editingStatus }
                    : order
            ));

            const updatedOrder = { ...selectedOrder, orderStatus: editingStatus };
            setSelectedOrder(updatedOrder);
            alert('Stato ordine aggiornato con successo');
        } catch (err) {
            console.error('Errore nell\'aggiornamento dello status:', err);
            setError('Errore nell\'aggiornamento dello stato dell\'ordine');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('it-IT', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    };

    const getStatusBadgeClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'status-pending';
            case 'processing':
                return 'status-processing';
            case 'completed':
                return 'status-completed';
            case 'cancelled':
                return 'status-cancelled';
            default:
                return 'status-default';
        }
    };

    const filteredOrders = filterStatus === 'All'
        ? orders
        : orders.filter(order => order.orderStatus === filterStatus);

    if (loading) {
        return <div className="orders-admin-container"><p>Caricamento ordini...</p></div>;
    }

    if (!isAdmin) {
        return <div className="orders-admin-container"><p className="error-message">Accesso non autorizzato</p></div>;
    }

    return (
        <div className="orders-admin-container">
            <div className="orders-admin-content">
                <div className="orders-header">
                    <h1>Gestione Ordini</h1>
                    <p className="orders-count">Totale ordini: <strong>{orders.length}</strong></p>
                </div>

                {error && <p className="error-message">{error}</p>}

                <div className="orders-controls">
                    <div className="filter-group">
                        <label>Filtra per stato:</label>
                        <select 
                            value={filterStatus} 
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="filter-select"
                        >
                            <option value="All">Tutti gli ordini</option>
                            <option value="Pending">In sospeso</option>
                            <option value="Processing">In elaborazione</option>
                            <option value="Completed">Completato</option>
                            <option value="Cancelled">Cancellato</option>
                        </select>
                    </div>
                    <button className="btn-refresh" onClick={fetchOrders}>
                        Aggiorna
                    </button>
                </div>

                {filteredOrders.length === 0 ? (
                    <p className="no-orders">Nessun ordine trovato</p>
                ) : (
                    <div className="orders-grid">
                        {filteredOrders.map(order => (
                            <div 
                                key={order.orderId} 
                                className={`order-card ${selectedOrder?.orderId === order.orderId ? 'selected' : ''}`}
                                onClick={() => handleSelectOrder(order)}
                            >
                                <div className="order-card-header">
                                    <div className="order-info">
                                        <h3 className="order-id">#{order.orderId?.substring(0, 8) || 'N/A'}</h3>
                                        <span className={`status-badge ${getStatusBadgeClass(order.orderStatus)}`}>
                                            {order.orderStatus || 'N/A'}
                                        </span>
                                    </div>
                                    <p className="order-date">{formatDate(order.orderDate)}</p>
                                </div>

                                <div className="order-summary">
                                    <div className="summary-item">
                                        <span className="label">Utente ID:</span>
                                        <span className="value">{order.userId || 'N/A'}</span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="label">Totale:</span>
                                        <span className="value amount">{formatCurrency(order.totalAmount)}</span>
                                    </div>
                                </div>

                                {selectedOrder?.orderId === order.orderId && (
                                    <div className="order-details" onClick={(e) => e.stopPropagation()}>
                                        {selectedOrderUser && (
                                            <div className="details-section">
                                                <h4>Dati Utente</h4>
                                                <div className="detail-item">
                                                    <span className="label">Nome Cognome:</span>
                                                    <span className="value">{selectedOrderUser.name || ''} {selectedOrderUser.surname || ''}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="label">Email:</span>
                                                    <span className="value">{selectedOrderUser.email || 'N/A'}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="label">Telefono:</span>
                                                    <span className="value">{selectedOrderUser.phone || 'N/A'}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="label">Indirizzo:</span>
                                                    <span className="value">{selectedOrderUser.adress || 'N/A'}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="label">Città:</span>
                                                    <span className="value">{selectedOrderUser.city || 'N/A'}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="label">CAP:</span>
                                                    <span className="value">{selectedOrderUser.postalCode || 'N/A'}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="label">Paese:</span>
                                                    <span className="value">{selectedOrderUser.country || 'N/A'}</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="details-section">
                                            <h4>Informazioni Ordine</h4>
                                            <div className="detail-item">
                                                <span className="label">ID Ordine:</span>
                                                <span className="value">{order.orderId}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="label">ID Utente:</span>
                                                <span className="value">{order.userId}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="label">Data Ordine:</span>
                                                <span className="value">{formatDate(order.orderDate)}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="label">Stato Attuale:</span>
                                                <span className={`value status-badge ${getStatusBadgeClass(order.orderStatus)}`}>
                                                    {order.orderStatus}
                                                </span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="label">Importo Totale:</span>
                                                <span className="value amount">{formatCurrency(order.totalAmount)}</span>
                                            </div>
                                        </div>

                                        <div className="details-section status-update-section">
                                            <h4>Aggiorna Stato Ordine</h4>
                                            <div className="status-update-form">
                                                <div className="form-group-status">
                                                    <label className="status-label">Nuovo Stato:</label>
                                                    <select 
                                                        value={editingStatus !== null ? editingStatus : (order.orderStatus || 'Pending')} 
                                                        onChange={(e) => handleStatusChange(e.target.value)}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="status-select"
                                                    >
                                                        <option value="Pending">In sospeso</option>
                                                        <option value="Processing">In elaborazione</option>
                                                        <option value="Completed">Completato</option>
                                                        <option value="Cancelled">Cancellato</option>
                                                    </select>
                                                </div>
                                                <div className="status-actions">
                                                    <button 
                                                        className="btn-save-status"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleSaveStatus();
                                                        }}
                                                        disabled={updatingStatus || editingStatus === order.orderStatus || editingStatus === null}
                                                    >
                                                        {updatingStatus ? 'Salvataggio...' : 'Salva Stato'}
                                                    </button>
                                                    <button 
                                                        className="btn-cancel-status"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingStatus(order.orderStatus);
                                                        }}
                                                        disabled={updatingStatus}
                                                    >
                                                        Annulla
                                                    </button>
                                                </div>
                                            </div>
                                            {editingStatus !== order.orderStatus && editingStatus !== null && (
                                                <p className="status-change-info">
                                                    Cambio di stato da <strong>{order.orderStatus}</strong> a <strong>{editingStatus}</strong>
                                                </p>
                                            )}
                                        </div>

                                        {order.cars && order.cars.length > 0 && (
                                            <div className="details-section">
                                                <h4>Auto nell'ordine</h4>
                                                <div className="cars-list">
                                                    {order.cars.map((car, idx) => (
                                                        <div key={idx} className="car-item">
                                                            <div className="car-name">
                                                                {car.make && car.model ? `${car.make} ${car.model}` : 'Auto'}
                                                            </div>
                                                            <div className="car-price">
                                                                {car.price && formatCurrency(car.price)}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {order.payments && (
                                            <div className="details-section">
                                                <h4>Pagamento</h4>
                                                <div className="detail-item">
                                                    <span className="label">Tipo:</span>
                                                    <span className="value">{order.payments.paymentType}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="label">Importo:</span>
                                                    <span className="value">{formatCurrency(order.payments.amount)}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="label">Data Pagamento:</span>
                                                    <span className="value">{formatDate(order.payments.paymentDate)}</span>
                                                </div>
                                            </div>
                                        )}

                                        {order.shipments && (
                                            <div className="details-section">
                                                <h4>Spedizione</h4>
                                                <div className="detail-item">
                                                    <span className="label">Tipo:</span>
                                                    <span className="value">{order.shipments.shipmentType}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="label">Tracking:</span>
                                                    <span className="value">{order.shipments.trackingNumber}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="label">Indirizzo:</span>
                                                    <span className="value">
                                                        {order.shipments.shippingAddress}, {order.shipments.shippingCity} {order.shipments.shippingPostalCode}
                                                    </span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="label">Stato Spedizione:</span>
                                                    <span className="value">{order.shipments.shipmentStatus}</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="order-actions">
                                            <button 
                                                className="btn-delete" 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteOrder(order.orderId);
                                                }}
                                            >
                                                Elimina Ordine
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
