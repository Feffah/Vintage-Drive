import { useState } from 'react';
import './Auth.css';

export default function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        // Simulate JWT login (replace with real API call)
        if (email === 'user@vintage.com' && password === 'password') {
            const fakeToken = 'jwt-token-example';
            localStorage.setItem('token', fakeToken);
            onLogin();
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="submit">Login</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
}
