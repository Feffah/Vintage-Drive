import { useState } from 'react';
import './Auth.css';
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
      const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        fetch("http://localhost:5034/api/Users/login"
            , {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: email,
                    password: password,
                }),
            })
            .then((response) => {
                if (!response.ok) {
                setError('Credenziali non valide');
                }
                return response.json();
            })
            .then((json) => {
                console.log(json)
                localStorage.setItem("access_token", json.token)
                localStorage.setItem("username", json.userName)
                localStorage.setItem("roles", JSON.stringify(json.roles))
                navigate("/products")
                onLogin();
                // setData(json);
                // setLoading(false);
            })
            .catch((err) => {
                console.log(err)            
                setError('Credenziali non valide');

                // setError(err.message);
                // setLoading(false);
            });
        
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" value={email} onChange={e => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="submit">Login</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
}
