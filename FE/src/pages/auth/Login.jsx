import { useState } from 'react';
import './Auth.css';
import { useNavigate } from "react-router-dom";
import { login } from "../../services/apiService";

export default function Login({ onLogin }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login({
                username: email,
                password: password,
            });

            if (result && result.token) {
                navigate("/products");
                onLogin();
            } else {
                setError('Credenziali non valide');
            }
        } catch (err) {
            console.log(err);
            setError('Credenziali non valide');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" value={email} onChange={e => setEmail(e.target.value)} required disabled={loading} />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required disabled={loading} />
                <button type="submit" disabled={loading}>{loading ? 'Accesso in corso...' : 'Login'}</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
}
