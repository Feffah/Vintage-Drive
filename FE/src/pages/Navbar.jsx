import './Navbar.css';
import { Link } from 'react-router-dom'

export default function Navbar({ isAuthenticated, onLogout, onNavigate, cartCount }) {
    return (
        <nav className="navbar px-4">
            <span className="logo">Vintage Cars</span>
            <div className='d-flex d-row align-items-center'>
                <Link to="/"><p>Home</p></Link>
                <Link to="/products"><p>Prodotti</p></Link>
                <Link to="/cart"><p>Carrello{cartCount > 0 ? ` (${cartCount})` : ''}</p></Link>
                {isAuthenticated ? (
                    <p className='mx-2' onClick={onLogout}>Logout</p>
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
