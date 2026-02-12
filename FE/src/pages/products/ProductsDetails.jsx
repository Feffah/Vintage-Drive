import './Products.css';
import { useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import { getCarById } from "../../services/apiService";
import { checkLogin } from "../../services/loginService";
import { useNavigate } from "react-router-dom";

export default function ProductsDetails({ onAddToCart }) {
    const { productId } = useParams();
    const navigate = useNavigate();
    
    const [selectedCar, setCar] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLogged, setLogged] = useState(false);

    useEffect(() => {
        const checkLogged = () => {
            setLogged(checkLogin())
        }
        checkLogged();
        fetchData();
    }, [productId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await getCarById(productId);
            setCar(response);
        } catch (err) {
            setError(err.message || "Errore nel caricamento");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const goToLogin = () => {
        navigate("/login");
    }

    const goToProducts = () => {
        navigate("/products");
    }

    if (loading) return <div className="products-container"><p>Caricamento...</p></div>;
    if (error) return <div className="products-container"><p style={{ color: 'red' }}>{error}</p></div>;
    if (!selectedCar) return <div className="products-container"><p>Auto non trovata</p></div>;

    return (
        <div className="products-container">
            <button className="cardButton" onClick={goToProducts} style={{ marginBottom: '2rem' }}>
                ← Torna ai prodotti
            </button>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start', maxWidth: '1000px', margin: '0 auto' }}>
                <div>
                    {selectedCar.image && (
                        <img src={selectedCar.image} alt={selectedCar.make} style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }} />
                    )}
                </div>
                
                <div>
                    <h2 style={{ color: '#b48a78', marginBottom: '0.5rem' }}>{selectedCar.make}</h2>
                    <h3 style={{ color: '#666', marginBottom: '1rem' }}>{selectedCar.model}</h3>
                    
                    <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                        <p><strong>Anno:</strong> {selectedCar.year || 'N/A'}</p>
                        <p><strong>Prezzo:</strong> <span style={{ fontSize: '1.3em', color: '#b48a78', fontWeight: 'bold' }}>${selectedCar.price?.toLocaleString() || '0'}</span></p>
                        <p><strong>Categorie:</strong> {selectedCar.categories.map(cat => cat.name).join(', ') || 'N/A'}</p>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <p><strong>Descrizione:</strong></p>
                        <p style={{ color: '#666', lineHeight: '1.6' }}>{selectedCar.description || 'Nessuna descrizione disponibile'}</p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {isLogged ? (
                            <button 
                                className="cardButton" 
                                onClick={() => onAddToCart(selectedCar)}
                                style={{ flex: 1, minWidth: '150px', background: '#b48a78', color: '#fff', fontWeight: 'bold', padding: '0.8rem' }}
                            >
                                Aggiungi al carrello
                            </button>
                        ) : (
                            <button 
                                className="cardButton" 
                                onClick={goToLogin}
                                style={{ flex: 1, minWidth: '150px', background: '#666', color: '#fff', fontWeight: 'bold', padding: '0.8rem' }}
                            >
                                Effettua il login per acquistare
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
