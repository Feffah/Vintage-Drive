import { useState, useEffect } from 'react';
import { getCategories } from "../../services/apiService";

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const categoriesRes = await getCategories()
            setCategories(categoriesRes);
        } catch (err) {
            setError("Errore nel caricamento auto");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    
    return (
        <>
        </>
    )
}
