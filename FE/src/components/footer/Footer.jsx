import React from 'react';
import './Footer.css';


const Footer = () => {
    const year = new Date().getFullYear();
    return (
        <footer className="footer p-4">
            <p className='m-0'>Copyright © {year} Vintage Drive. Tutti i diritti riservati.</p>
        </footer>
    );
};

export default Footer;
