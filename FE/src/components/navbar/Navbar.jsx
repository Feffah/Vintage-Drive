import './Navbar.css';
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';

export default function Navbar({ isAuthenticated, onLogout, onNavigate, cartCount }) {
    const [roles, setRole] = useState(JSON.parse(localStorage.getItem('roles')));

    const navigate = useNavigate();
    const logout = () => {
        localStorage.clear();
        onLogout();
        navigate("/");
    }
    return (
        <nav className="navbar px-4">
            <span className="logo">Vintage Cars</span>
            <div className='d-flex d-row align-items-center'>
                <Link to="/"><p>Home</p></Link>
                <Link to="/products"><p>Prodotti</p></Link>
                {roles != null &&
                    roles.map(m => m === "Admin") &&
                    <Link to="/categories"><p>Categorie</p></Link>
                }
                <Link to="/cart"><p>Carrello{cartCount > 0 ? ` (${cartCount})` : ''}</p></Link>
                {isAuthenticated ? (
                    <p className='mx-2' onClick={logout}>Logout</p>
                ) : (
                    <>
                        <Link to="/login"><p>Login</p></Link>
                        <Link to="/register"><p>Registrati</p></Link>
                    </>
                )}
            </div>
        </nav>
    );
}
