import { useState, useEffect } from 'react';
import '../products/Products.css';
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../services/apiService";
import { checkLogin } from "../../services/loginService";

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLogged, setLogged] = useState(false);
    const [roles, setRole] = useState(JSON.parse(localStorage.getItem('roles')));
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [editingId, setEditingId] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const categoriesRes = await getCategories()
            setCategories(categoriesRes);
        } catch (err) {
            setError("Errore nel caricamento categorie");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const checkLogged = () => {
            setLogged(checkLogin())
        }
        checkLogged();
        fetchData();
    }, []);

    const isAdmin = roles && roles.some(role => role === "Admin");

    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateCategory(editingId, formData);
                setCategories(prev => prev.map(cat => cat.categoryId === editingId ? { ...cat, ...formData } : cat));
                setEditingId(null);
            } else {
                await createCategory(formData);
            }
            setFormData({ name: ''});
            setShowForm(false);
            fetchData();
        } catch (err) {
            setError("Errore nel salvare la categoria");
            console.error(err);
        }
    };

    const handleEditCategory = (category) => {
        setFormData({ name: category.name});
        setEditingId(category.categoryId);
        setShowForm(true);
    };

    const handleDeleteCategory = async (categoryId) => {
        if (window.confirm('Sei sicuro di voler eliminare questa categoria?')) {
            try {
                await deleteCategory(categoryId);
                setCategories(prev => prev.filter(cat => cat.categoryId !== categoryId));
            } catch (err) {
                setError("Errore nell'eliminazione della categoria");
                console.error(err);
            }
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setFormData({ name: ''});
        setEditingId(null);
    };

    if (loading) return <p className="products-container">Caricamento...</p>;

    return (
        <div className="products-container">
            <h2>Categorie</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {isAdmin && (
                <div className='d-flex align-items-center justify-content-center gap-3' style={{ marginBottom: '2rem' }}>
                    {!showForm ? (
                        <button className="cardButton" onClick={() => setShowForm(true)}>
                            Aggiungi categoria
                        </button>
                    ) : (
                        <form onSubmit={handleAddCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '400px' }}>
                            <input
                                type="text"
                                placeholder="Nome categoria"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                <button type="submit" className="cardButton">
                                    {editingId ? 'Salva' : 'Aggiungi'}
                                </button>
                                <button type="button" className="cardButton" onClick={handleCancel} style={{ background: '#999' }}>
                                    Annulla
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            {categories.length > 0 ? (
                <div className="products-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
                    {categories.map(category => (
                        <div className="product-card" key={category.categoryId}>
                            <h3 style={{ color: '#b48a78' }}>{category.name}</h3>
                            <p>Auto in questa categoria: {category.cars.length}</p>
                            {isAdmin && (
                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
                                    <button
                                        className="cardButton"
                                        onClick={() => handleEditCategory(category)}
                                        style={{ background: '#4CAF50', flex: 1 }}
                                    >
                                        Modifica
                                    </button>
                                    <button
                                        className="cardButton"
                                        onClick={() => handleDeleteCategory(category.categoryId)}
                                        style={{ background: '#f44336', flex: 1 }}
                                    >
                                        Elimina
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p>Nessuna categoria disponibile.</p>
            )}
        </div>
    )
}
