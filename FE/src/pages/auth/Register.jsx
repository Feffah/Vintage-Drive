import { useState } from 'react';
import './Auth.css';
import { useNavigate, Link } from "react-router-dom";
import { register } from "../../services/apiService";

export default function Register({ onRegister }) {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        userName: '',
        email: '',
        password: '',
        confirmPassword: '',
        address: '',
        city: '',
        country: '',
        phone: '',
        postalCode: '',
        birthday: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name || !formData.surname || !formData.userName || !formData.email || 
            !formData.password || !formData.confirmPassword || !formData.phone || !formData.birthday) {
            setError('Tutti i campi marcati con * sono obbligatori');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Le password non corrispondono');
            return;
        }

        if (formData.password.length < 6) {
            setError('La password deve essere di almeno 6 caratteri');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Inserisci un email valido');
            return;
        }

        setLoading(true);
        try {
            await register({
                name: formData.name,
                surname: formData.surname,
                userName: formData.userName,
                email: formData.email,
                password: formData.password,
                adress: formData.adress || '',
                city: formData.city || '',
                country: formData.country || '',
                phone: formData.phone,
                postalCode: formData.postalCode || '',
                birthday: formData.birthday,
                createAt: new Date().toISOString(),
                isDeleted: false,
                role: 'User'
            });

            setError('');
            alert('Registrazione completata! Accedi con le tue credenziali.');
            navigate("/login");
            onRegister();
        } catch (err) {
            console.log(err);
            setError(err.message || 'Errore nella registrazione. Verifica i dati e riprova.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2>Registrati</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Nome *"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                    />
                    <input
                        type="text"
                        name="surname"
                        placeholder="Cognome *"
                        value={formData.surname}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                    />
                    <input
                        type="text"
                        name="userName"
                        placeholder="Nome utente *"
                        value={formData.userName}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email *"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password *"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Conferma Password *"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                    />
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Telefono *"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                    />
                    <input
                        type="date"
                        name="birthday"
                        placeholder="Data di nascita *"
                        value={formData.birthday}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                    />
                    <input
                        type="text"
                        name="address"
                        placeholder="Indirizzo"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={loading}
                    />
                    <input
                        type="text"
                        name="city"
                        placeholder="Città"
                        value={formData.city}
                        onChange={handleInputChange}
                        disabled={loading}
                    />
                    <input
                        type="text"
                        name="postalCode"
                        placeholder="CAP"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        disabled={loading}
                    />
                    <input
                        type="text"
                        name="country"
                        placeholder="Paese"
                        value={formData.country}
                        onChange={handleInputChange}
                        disabled={loading}
                    />
                </div>
                <button type="submit" disabled={loading} style={{ marginTop: '1rem', width: '100%' }}>
                    {loading ? 'Registrazione in corso...' : 'Registrati'}
                </button>
                {error && <p className="error">{error}</p>}
                <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                    Hai già un account? <Link to="/login" style={{ color: '#b48a78', textDecoration: 'none', fontWeight: 'bold' }}>Accedi</Link>
                </p>
            </form>
        </div>
    );
}
