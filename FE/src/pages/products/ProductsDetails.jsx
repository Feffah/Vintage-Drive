import { useLocation } from "react-router-dom";
import { useState, useEffect } from 'react';

export default function ProductsDetails({ onAddToCart, car }) {
    const location = useLocation();
    const { carId } = location.state;
    const [selectedCar, setCar] = useState("");
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:5034/api/Cars/" + carId);
                if (!response.ok) throw new Error("Errore fetch");

                const json = await response.json();
                setCar(json);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    return (
        <div>
            <h2>{selectedCar.make}</h2>
            <p>{selectedCar.model}</p>
            <p>{selectedCar.price}</p>
            <button onClick={() => onAddToCart(selectedCar)}>Aggiungi al carrello</button>

        </div>
    );
}
