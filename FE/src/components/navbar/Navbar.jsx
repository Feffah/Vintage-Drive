import './Navbar.css';
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';

export default function Navbar({ isAuthenticated, onLogout, onNavigate, cartCount }) {
    const [roles, setRole] = useState(JSON.parse(localStorage.getItem('roles')));
    const navigate = useNavigate();

    useEffect(() => {
        setRole(JSON.parse(localStorage.getItem('roles')));
    }, [isAuthenticated]);

    const isAdmin = roles && roles.some(role => role === "Admin");

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
                <Link to="/products"><p>Auto</p></Link>
                {isAdmin && (
                    <>
                        <Link to="/categories"><p>Categorie</p></Link>
                        <Link to="/orders-admin"><p>Gestione Ordini</p></Link>
                    </>
                )}
                {!isAdmin && (
                    <>
                        <Link to="/cart"><p>Carrello{cartCount > 0 ? ` (${cartCount})` : ''}</p></Link>
                        {isAuthenticated && (
                            <Link to="/orders"><p>I miei Ordini</p></Link>
                        )}
                    </>
                )}
                {isAuthenticated && (
                    <Link to="/profile"><p>Profilo</p></Link>
                )}
                {isAuthenticated ? (
                    <p className='mx-2' onClick={logout} style={{ cursor: 'pointer' }}>Logout</p>
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
