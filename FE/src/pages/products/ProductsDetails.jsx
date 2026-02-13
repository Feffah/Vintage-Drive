import './Products.css';
import './ProductsDetails.css';
import { useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import { getCarById, BASE_URL } from "../../services/apiService";
import { checkLogin } from "../../services/loginService";
import { useNavigate } from "react-router-dom";

export default function ProductsDetails({ onAddToCart }) {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [selectedCar, setCar] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLogged, setLogged] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        setLogged(checkLogin());
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

    const goToLogin = () => navigate("/login");
    const goToProducts = () => navigate("/products");

    const ensureAbsoluteUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    if (loading) return <div className="products-container"><p>Caricamento...</p></div>;
    if (error) return <div className="products-container"><p style={{ color: 'red' }}>{error}</p></div>;
    if (!selectedCar) return <div className="products-container"><p>Auto non trovata</p></div>;

    // build images array
    const imgs = selectedCar.Images?.length
        ? selectedCar.Images.map(i => ensureAbsoluteUrl(i.imageUrl || i.ImageUrl))
        : (selectedCar.images?.length ? selectedCar.images.map(i => ensureAbsoluteUrl(i.imageUrl || i.ImageUrl)) : (selectedCar.image ? [ensureAbsoluteUrl(selectedCar.image)] : []));

    const prev = () => setActiveIndex((idx) => (idx - 1 + imgs.length) % imgs.length);
    const next = () => setActiveIndex((idx) => (idx + 1) % imgs.length);

    return (
        <div className="products-container">
            <button className="cardButton btn btn-secondary mb-3" onClick={goToProducts}>
                ← Torna ai prodotti
            </button>
            <div className="container" style={{ maxWidth: 1000 }}>
                <div className="row g-4">
                    <div className="col-12 col-md-6">
                        {imgs.length > 0 && (
                            <div className="position-relative">
                                <img src={imgs[activeIndex]} alt={selectedCar.make} className="pd-main-image" />
                                {imgs.length > 1 && (
                                    <>
                                        <button onClick={prev} className="pd-carousel-btn pd-carousel-left btn btn-dark">‹</button>
                                        <button onClick={next} className="pd-carousel-btn pd-carousel-right btn btn-dark">›</button>
                                    </>
                                )}

                                {imgs.length > 1 && (
                                    <div className="d-flex gap-2 mt-2 pd-thumbs">
                                        {imgs.map((u, i) => (
                                            <img key={i} src={u} alt={`thumb-${i}`} onClick={() => setActiveIndex(i)} className={`pd-thumb ${i === activeIndex ? 'active' : ''}`} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="col-12 col-md-6">
                    <h2 style={{ color: '#b48a78', marginBottom: '0.25rem' }}>{selectedCar.make} {selectedCar.model} {selectedCar.version ? `- ${selectedCar.version}` : ''}</h2>
                    <h3 style={{ color: '#666', marginBottom: '1rem' }}>{selectedCar.year || 'N/A'}</h3>

                    <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                        <p><strong style={{ width: '160px', display: 'inline-block' }}>Prezzo:</strong> <span style={{ fontSize: '1.2em', color: '#b48a78', fontWeight: 'bold' }}>${selectedCar.price?.toLocaleString() || '0'}</span></p>
                        <p><strong style={{ width: '160px', display: 'inline-block' }}>Categorie:</strong> {selectedCar.categories?.length ? selectedCar.categories.map(cat => cat.name).join(', ') : 'N/A'}</p>
                        <p><strong style={{ width: '160px', display: 'inline-block' }}>Immagini:</strong> {selectedCar.Images?.length ?? selectedCar.images?.length ?? (selectedCar.image ? 1 : 0)}</p>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <p><strong>Descrizione:</strong></p>
                        <p style={{ color: '#666', lineHeight: '1.6' }}>{selectedCar.description || 'Nessuna descrizione disponibile'}</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                        <div><strong>VIN:</strong> {selectedCar.vin || 'N/A'}</div>
                        <div><strong>Targa:</strong> {selectedCar.licensePlate || 'N/A'}</div>
                        <div><strong>Motore:</strong> {selectedCar.engineType || 'N/A'}</div>
                        <div><strong>Cilindrata (cc):</strong> {selectedCar.engineDisplacement ?? 'N/A'}</div>
                        <div><strong>Cavalli (HP):</strong> {selectedCar.horsePower ?? 'N/A'}</div>
                        <div><strong>Coppia (Nm):</strong> {selectedCar.torque ?? 'N/A'}</div>
                        <div><strong>Trasmissione:</strong> {selectedCar.transmission || 'N/A'}</div>
                        <div><strong>Marce:</strong> {selectedCar.gears ?? 'N/A'}</div>
                        <div><strong>Colore Esterno:</strong> {selectedCar.exteriorColor || 'N/A'}</div>
                        <div><strong>Colore Interno:</strong> {selectedCar.interiorColor || 'N/A'}</div>
                        <div><strong>Rivestimento:</strong> {selectedCar.interiorMaterial || 'N/A'}</div>
                        <div><strong>Tipo Carrozzeria:</strong> {selectedCar.bodyStyle || 'N/A'}</div>
                        <div><strong>Carburante:</strong> {selectedCar.fuelType || 'N/A'}</div>
                        <div><strong>Consumo (L/100km):</strong> {selectedCar.fuelConsumption ?? 'N/A'}</div>
                        <div><strong>Chilometraggio:</strong> {selectedCar.mileage ?? 'N/A'}</div>
                        <div><strong>Proprietari:</strong> {selectedCar.ownersCount ?? 'N/A'}</div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <p><strong>Condizione:</strong> {selectedCar.condition || 'N/A'}</p>
                        <p><strong>Visibile:</strong> {selectedCar.isVisible ? 'Sì' : 'No'}</p>
                        <p><strong>Stato Auto:</strong> {selectedCar.carStatus || 'N/A'}</p>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <p><strong>Documenti Originali:</strong> {selectedCar.hasOriginalDocuments ? 'Sì' : 'No'}</p>
                        <p><strong>ASI Certificato:</strong> {selectedCar.isAsiCertified ? 'Sì' : 'No'}</p>
                        <p><strong>Data Certificazione:</strong> {selectedCar.certificationDate ? new Date(selectedCar.certificationDate).toLocaleDateString() : 'N/A'}</p>
                        <p><strong>Idoneo alla circolazione:</strong> {selectedCar.isRoadLegal ? 'Sì' : 'No'}</p>
                        <p><strong>Ultima Revisione:</strong> {selectedCar.lastInspectionDate ? new Date(selectedCar.lastInspectionDate).toLocaleDateString() : 'N/A'}</p>
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
        </div>
    );
}
