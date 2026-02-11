import './Products.css';
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { getCars, getCarsByCategory, createCar } from "../../services/apiService";
import { getCategories } from "../../services/apiService";
import { checkLogin } from "../../services/loginService";
import { useNavigate } from "react-router-dom";


export default function Products({ onAddToCart, onNavigate }) {
    const navigate = useNavigate();

    const [cars, setCars] = useState([]);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLogged, setLogged] = useState(false);
    const [roles, setRole] = useState(JSON.parse(localStorage.getItem('roles')));

    useEffect(() => {
        const checkLogged = () => {
            setLogged(checkLogin())
        }

        checkLogged();
        fetchData();
    }, []);
    const fetchData = async () => {
        try {
            setLoading(true);
            const carsRes = await getCars();
            const categoriesRes = await getCategories()
            setCars(carsRes);
            setCategories(categoriesRes);
        } catch (err) {
            setError("Errore nel caricamento auto");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    const goToLogin = () => {
        navigate("/login");
    }

    const getCarsByCategoryAsync = async (categoryId) => {
        try {
            setLoading(true);
            const categoriesRes = await getCarsByCategory(categoryId);

            setCars(categoriesRes);
        } catch (err) {
            setError("Errore nel caricamento auto");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <p>Caricamento...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="products-container">
            <h2>Vintage Cars</h2>
            {roles != null &&
            roles.map(m => m === "Admin") &&
            <div className='d-flex align-items-center justify-content-center gap-3'>
                <button className="cardButton" >Aggiungi un'auto</button>
                <button className="cardButton" >Visualizza categorie</button>
            </div>

            }
            <p className='cat-select'>Seleziona la categoria</p>
            <div className="categories-list d-flex align-items-center justify-content-center mb-5">
                <div className="category-card" onClick={() => fetchData()}>
                    <p className='mb-0 py-2 px-4'>Tutte le auto</p>
                </div>
                {categories.map(cat => (
                    <div className="category-card" key={cat.categoryId} onClick={() => getCarsByCategoryAsync(cat.categoryId)}>
                        <p className='mb-0 py-2 px-4'>{cat.name}</p>
                    </div>
                ))}
            </div>
            <div className="products-list">
                {cars.length > 0 &&
                    cars.map(car => (
                        <div className="product-card" key={car.carId}>
                            {/* <img src={car.image} alt={car.name} /> */}
                            <h3>{car.make}</h3>
                            <p>{car.model}</p>
                            <p>${car.price}</p>
                            {isLogged &&
                                <button  className="cardButton" onClick={() => onAddToCart(car)}>Aggiungi al carrello</button>
                            }
                            {!isLogged &&
                                <button className="cardButton" onClick={() => goToLogin()}>Effettua il login per acquistare</button>
                            }
                            <Link to={`/details/${car.carId}`} state={{ carId: car.carId }}
                            >
                                <button className="cardButton" >Visualizza dettagli</button>
                            </Link>
                        </div>
                    ))}
                {cars.length == 0 &&
                    <h2>Ops... nessuna auto trovata per la categoria selezionata</h2>
                }
            </div>
        </div>
    );
}
