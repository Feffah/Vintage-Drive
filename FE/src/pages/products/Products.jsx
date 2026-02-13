import './Products.css';
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { getCars, getCarsByCategory, createCar, updateCar, deleteCar, createCategory, setCarToCategory, createCarForm, updateCarForm, BASE_URL } from "../../services/apiService";
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
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [editingCarId, setEditingCarId] = useState(null);

    const [formData, setFormData] = useState({
        make: '',
        model: '',
        version: '',
        year: new Date().getFullYear(),
        vin: '',
        licensePlate: '',
        engineType: '',
        engineDisplacement: 0,
        horsePower: 0,
        torque: null,
        transmission: '',
        gears: null,
        exteriorColor: '',
        interiorColor: '',
        interiorMaterial: '',
        mileage: 0,
        fuelType: '',
        fuelConsumption: null,
        bodyStyle: '',
        ownersCount: 1,
        hasOriginalDocuments: false,
        condition: 'Ottima',
        isAsiCertified: false,
        certificationDate: null,
        isRoadLegal: true,
        lastInspectionDate: null,
        description: '',
        price: 0,
        carStatus: 'Available',
        isVisible: true,
    });
    const [imageFiles, setImageFiles] = useState([]);

    // Resolve image URL from different possible property names
    const getFirstImageUrlFromCar = (car) => {
        if (!car) return null;
        const imgs = car.Images || car.images || [];
        if (imgs.length > 0) {
            const first = imgs[0];
            const url = first?.imageUrl || first?.ImageUrl || first?.url || first?.imageUrlPath || null;
            return ensureAbsoluteUrl(url);
        }
        return ensureAbsoluteUrl(car.image || car.Image || null);
    };

    const ensureAbsoluteUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    };

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

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'number' ? (value === '' ? null : Number(value)) : value)
        }));
    };

    const handleImagesChange = (e) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        setImageFiles(files);
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) {
            setError('Inserisci il nome della categoria');
            return;
        }
        try {
            const newCat = await createCategory({ name: newCategoryName, description: '' });
            setCategories(prev => [...prev, newCat]);
            setSelectedCategories(prev => [...prev, newCat.categoryId]);
            setNewCategoryName('');
            setShowNewCategoryForm(false);
        } catch (err) {
            setError('Errore nella creazione della categoria');
            console.error(err);
        }
    };

    const handleCategoryToggle = (categoryId) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const validateForm = () => {
        if (!formData.make || !formData.model || !formData.year || !formData.vin ||
            !formData.licensePlate || !formData.engineType || !formData.transmission ||
            !formData.exteriorColor || !formData.bodyStyle || !formData.price || !formData.description) {
            setError('Completa tutti i campi obbligatori');
            return false;
        }
        if (selectedCategories.length === 0) {
            setError('Seleziona almeno una categoria');
            return false;
        }
        return true;
    };

    const handleAssignCategoriesToCar = async (carId, categoryIds) => {
        try {
            for (const categoryId of categoryIds) {
                await setCarToCategory(carId, categoryId);
            }
        } catch (err) {
            console.error('Errore nell\'assegnazione delle categorie:', err);
            throw new Error('Errore nell\'assegnazione delle categorie');
        }
    };

    const handleSubmitCreateCar = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            // Prepara i dati dell'auto
            const carData = {
                ...formData,
                year: parseInt(formData.year),
                engineDisplacement: parseInt(formData.engineDisplacement) || 0,
                horsePower: parseInt(formData.horsePower) || 0,
                mileage: parseInt(formData.mileage) || 0,
                price: parseFloat(formData.price) || 0,
                torque: formData.torque ? parseInt(formData.torque) : null,
                gears: formData.gears ? parseInt(formData.gears) : null,
                fuelConsumption: formData.fuelConsumption ? parseFloat(formData.fuelConsumption) : null,
                certificationDate: formData.certificationDate || null,
                lastInspectionDate: formData.lastInspectionDate || null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            // Build FormData including fields
            const fd = new FormData();
            Object.keys(carData).forEach(key => {
                if (carData[key] !== undefined && carData[key] !== null) {
                    fd.append(key, carData[key]);
                }
            });

            const imagesDtos = imageFiles.map(file => ({
                ImageUrl: file.name,
                CarId: editingCarId
            }));

            if (imagesDtos.length > 0) {
                fd.append('Images', JSON.stringify(imagesDtos));
                imageFiles.forEach(file => fd.append('UploadedImages', file));
            }


            const newCar = await createCarForm(fd);

            const carId = newCar.carId || newCar.id || newCar.carId;

            // Assegna le categorie all'auto
            if (selectedCategories.length > 0) {
                await handleAssignCategoriesToCar(carId, selectedCategories);
            }

            // Se la creazione è riuscita, aggiungi l'auto alla lista
            setCars(prev => [...prev, newCar]);

            // Reset del form
            setFormData({
                make: '',
                model: '',
                version: '',
                year: new Date().getFullYear(),
                vin: '',
                licensePlate: '',
                engineType: '',
                engineDisplacement: 0,
                horsePower: 0,
                torque: null,
                transmission: '',
                gears: null,
                exteriorColor: '',
                interiorColor: '',
                interiorMaterial: '',
                mileage: 0,
                fuelType: '',
                fuelConsumption: null,
                bodyStyle: '',
                ownersCount: 1,
                hasOriginalDocuments: false,
                condition: 'Ottima',
                isAsiCertified: false,
                certificationDate: null,
                isRoadLegal: true,
                lastInspectionDate: null,
                description: '',
                price: 0,
                carStatus: 'Available',
                isVisible: true,
            });
            setSelectedCategories([]);
            setShowCreateForm(false);
            setImageFiles([]);

            alert('Auto creata con successo!');
        } catch (err) {
            console.error(err);
            setError(err.message || 'Errore nella creazione dell\'auto');
        } finally {
            setLoading(false);
        }
    };

    const handleEditCar = (car) => {
        setEditingCarId(car.carId);
        setFormData({
            make: car.make,
            model: car.model,
            version: car.version || '',
            year: car.year,
            vin: car.vin,
            licensePlate: car.licensePlate,
            engineType: car.engineType,
            engineDisplacement: car.engineDisplacement,
            horsePower: car.horsePower,
            torque: car.torque,
            transmission: car.transmission,
            gears: car.gears,
            exteriorColor: car.exteriorColor,
            interiorColor: car.interiorColor || '',
            interiorMaterial: car.interiorMaterial || '',
            mileage: car.mileage,
            fuelType: car.fuelType || '',
            fuelConsumption: car.fuelConsumption,
            bodyStyle: car.bodyStyle,
            ownersCount: car.ownersCount,
            hasOriginalDocuments: car.hasOriginalDocuments,
            condition: car.condition,
            isAsiCertified: car.isAsiCertified,
            certificationDate: car.certificationDate,
            isRoadLegal: car.isRoadLegal,
            lastInspectionDate: car.lastInspectionDate,
            description: car.description,
            price: car.price,
            carStatus: car.carStatus,
            isVisible: car.isVisible,
        });
        setSelectedCategories(car.categories?.map(c => c.categoryId) || []);
        // Keep a reference to existing images if needed (not required now)
        setImageFiles([]);
        setShowCreateForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteCar = async (carId) => {
        if (window.confirm('Sei sicuro di voler eliminare questa auto?')) {
            try {
                await deleteCar(carId);
                setCars(prev => prev.filter(car => car.carId !== carId));
                alert('Auto eliminata con successo!');
            } catch (err) {
                console.error(err);
                setError('Errore nell\'eliminazione dell\'auto');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            make: '',
            model: '',
            version: '',
            year: new Date().getFullYear(),
            vin: '',
            licensePlate: '',
            engineType: '',
            engineDisplacement: 0,
            horsePower: 0,
            torque: null,
            transmission: '',
            gears: null,
            exteriorColor: '',
            interiorColor: '',
            interiorMaterial: '',
            mileage: 0,
            fuelType: '',
            fuelConsumption: null,
            bodyStyle: '',
            ownersCount: 1,
            hasOriginalDocuments: false,
            condition: 'Ottima',
            isAsiCertified: false,
            certificationDate: null,
            isRoadLegal: true,
            lastInspectionDate: null,
            description: '',
            price: 0,
            carStatus: 'Available',
            isVisible: true,
        });
        setSelectedCategories([]);
        setEditingCarId(null);
    };

    const handleSubmitUpdateCar = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const carData = {
                ...formData,
                year: parseInt(formData.year),
                engineDisplacement: parseInt(formData.engineDisplacement) || 0,
                horsePower: parseInt(formData.horsePower) || 0,
                mileage: parseInt(formData.mileage) || 0,
                price: parseFloat(formData.price) || 0,
                torque: formData.torque ? parseInt(formData.torque) : null,
                gears: formData.gears ? parseInt(formData.gears) : null,
                fuelConsumption: formData.fuelConsumption ? parseFloat(formData.fuelConsumption) : null,
                certificationDate: formData.certificationDate || null,
                lastInspectionDate: formData.lastInspectionDate || null,
                updatedAt: new Date().toISOString(),
            };

            // Build FormData for update
            const fd = new FormData();
            Object.keys(carData).forEach(key => {
                if (carData[key] !== undefined && carData[key] !== null) {
                    fd.append(key, carData[key]);
                }
            });

            const imagesDtos = imageFiles.map(file => ({
                ImageUrl: file.name,
                CarId: editingCarId
            }));

            if (imagesDtos.length > 0) {
                fd.append('Images', JSON.stringify(imagesDtos));
                imageFiles.forEach(file => fd.append('UploadedImages', file));
            }

            await updateCarForm(editingCarId, fd);

            // Aggiorna le categorie associate all'auto
            if (selectedCategories.length > 0) {
                await handleAssignCategoriesToCar(editingCarId, selectedCategories);
            }

            setCars(prev => prev.map(car => car.carId === editingCarId ? { ...car, ...carData } : car));

            resetForm();
            setShowCreateForm(false);
            alert('Auto modificata con successo!');
        } catch (err) {
            console.error(err);
            setError(err.message || 'Errore nella modifica dell\'auto');
        } finally {
            setLoading(false);
        }
    };

    const isAdmin = roles && roles.some(role => role === "Admin");

    if (loading && cars.length === 0) return <p className="products-container">Caricamento...</p>;
    if (error && !showCreateForm) return <p className="products-container text-danger">{error}</p>;

    return (
        <div className="products-container">
            <h2>Vintage Cars</h2>

            {isAdmin && (
                <div className='d-flex align-items-center justify-content-center gap-3 mb-5'>
                    {!showCreateForm ? (
                        <>
                            <button className="cardButton" onClick={() => setShowCreateForm(true)}>
                                + Aggiungi un'auto
                            </button>
                            <button className="cardButton" onClick={() => navigate('/categories')}>
                                Visualizza categorie
                            </button>
                        </>
                    ) : null}
                </div>
            )}

            {showCreateForm && isAdmin && (
                <div className="form-container">
                    <div className="form-header">
                        <h3>
                            {editingCarId ? 'Modifica Auto' : 'Aggiungi Nuova Auto'}
                        </h3>
                        <button
                            onClick={() => {
                                setShowCreateForm(false);
                                resetForm();
                            }}
                            className="form-close-btn"
                        >
                            ✕
                        </button>
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <form onSubmit={editingCarId ? handleSubmitUpdateCar : handleSubmitCreateCar} className="form-grid">
                        <div className="form-grid-full">
                            <h4 className="form-section-title">Informazioni Generali</h4>
                        </div>

                        <div>
                            <label className="form-label">Casa Produttrice *</label>
                            <input type="text" className="form-control" name="make" value={formData.make} onChange={handleInputChange} placeholder="es. Ford" required />
                        </div>

                        <div>
                            <label className="form-label">Modello *</label>
                            <input type="text" className="form-control" name="model" value={formData.model} onChange={handleInputChange} placeholder="es. Mustang" required />
                        </div>

                        <div>
                            <label className="form-label">Versione</label>
                            <input type="text" className="form-control" name="version" value={formData.version} onChange={handleInputChange} placeholder="es. Shelby GT500" />
                        </div>

                        <div>
                            <label className="form-label">Anno *</label>
                            <input type="number" className="form-control" name="year" value={formData.year} onChange={handleInputChange} placeholder="2020" required />
                        </div>

                        <div>
                            <label className="form-label">VIN *</label>
                            <input type="text" className="form-control" name="vin" value={formData.vin} onChange={handleInputChange} placeholder="es. 1FTFW1ET5DFC..." required />
                        </div>

                        <div>
                            <label className="form-label">Targa *</label>
                            <input type="text" className="form-control" name="licensePlate" value={formData.licensePlate} onChange={handleInputChange} placeholder="es. AA123BB" required />
                        </div>

                        <div className="form-grid-full">
                            <h4 className="form-section-title">Motore</h4>
                        </div>

                        <div>
                            <label className="form-label">Tipo Motore *</label>
                            <input type="text" className="form-control" name="engineType" value={formData.engineType} onChange={handleInputChange} placeholder="es. V8" required />
                        </div>

                        <div>
                            <label className="form-label">Cilindrata (cc)</label>
                            <input type="number" className="form-control" name="engineDisplacement" value={formData.engineDisplacement} onChange={handleInputChange} placeholder="5000" />
                        </div>

                        <div>
                            <label className="form-label">Cavalli Vapore</label>
                            <input type="number" className="form-control" name="horsePower" value={formData.horsePower} onChange={handleInputChange} placeholder="500" />
                        </div>

                        <div>
                            <label className="form-label">Coppia (Nm)</label>
                            <input type="number" className="form-control" name="torque" value={formData.torque || ''} onChange={handleInputChange} placeholder="625" />
                        </div>

                        <div>
                            <label className="form-label">Trasmissione *</label>
                            <select className="form-select" name="transmission" value={formData.transmission} onChange={handleInputChange} required>
                                <option value="">Seleziona trasmissione</option>
                                <option value="Automatica">Automatica</option>
                                <option value="Manuale">Manuale</option>
                            </select>
                        </div>

                        <div>
                            <label className="form-label">Marce</label>
                            <input type="number" className="form-control" name="gears" value={formData.gears || ''} onChange={handleInputChange} placeholder="4" />
                        </div>

                        <div>
                            <label className="form-label">Carburante</label>
                            <select className="form-select" name="fuelType" value={formData.fuelType} onChange={handleInputChange}>
                                <option value="">Seleziona carburante</option>
                                <option value="Benzina">Benzina</option>
                                <option value="Diesel">Diesel</option>
                            </select>
                        </div>

                        <div>
                            <label className="form-label">Consumo (L/100km)</label>
                            <input type="number" step="0.1" className="form-control" name="fuelConsumption" value={formData.fuelConsumption || ''} onChange={handleInputChange} placeholder="10.5" />
                        </div>

                        <div className="form-grid-full">
                            <h4 className="form-section-title">Aspetto</h4>
                        </div>

                        <div>
                            <label className="form-label">Tipo Carrozzeria *</label>
                            <select className="form-select" name="bodyStyle" value={formData.bodyStyle} onChange={handleInputChange} required>
                                <option value="">Seleziona carrozzeria</option>
                                <option value="Berlina">Berlina</option>
                                <option value="Coupé">Coupé</option>
                                <option value="Cabriolet">Cabriolet</option>
                                <option value="Station wagon">Station wagon</option>
                            </select>
                        </div>

                        <div>
                            <label className="form-label">Colore Esterno *</label>
                            <input type="text" className="form-control" name="exteriorColor" value={formData.exteriorColor} onChange={handleInputChange} placeholder="es. Rosso" required />
                        </div>

                        <div>
                            <label className="form-label">Colore Interno</label>
                            <input type="text" className="form-control" name="interiorColor" value={formData.interiorColor} onChange={handleInputChange} placeholder="es. Nero" />
                        </div>

                        <div>
                            <label className="form-label">Rivestimento Interno</label>
                            <select className="form-select" name="interiorMaterial" value={formData.interiorMaterial} onChange={handleInputChange}>
                                <option value="">Seleziona materiale</option>
                                <option value="Pelle">Pelle</option>
                                <option value="Alcantara">Alcantara</option>
                                <option value="Tessuto">Tessuto</option>
                                <option value="Velluto">Velluto</option>
                            </select>
                        </div>

                        <div className="form-grid-full">
                            <h4 className="form-section-title">Condizione</h4>
                        </div>

                        <div>
                            <label className="form-label">Chilometraggio</label>
                            <input type="number" className="form-control" name="mileage" value={formData.mileage} onChange={handleInputChange} placeholder="50000" />
                        </div>

                        <div>
                            <label className="form-label">Numero Proprietari</label>
                            <input type="number" className="form-control" name="ownersCount" value={formData.ownersCount} onChange={handleInputChange} placeholder="1" />
                        </div>

                        <div>
                            <label className="form-label">Condizione</label>
                            <select className="form-select" name="condition" value={formData.condition} onChange={handleInputChange}>
                                <option value="Scarsa">Scarsa</option>
                                <option value="Media">Media</option>
                                <option value="Buona">Buona</option>
                                <option value="Ottima">Ottima</option>
                                <option value="Come Nuova">Come Nuova</option>
                            </select>
                        </div>

                        <div style={{ gridColumn: '1 / 2' }}>
                            <label className="checkbox-wrapper">
                                <input type="checkbox" name="hasOriginalDocuments" checked={formData.hasOriginalDocuments} onChange={handleInputChange} />
                                Documenti Originali
                            </label>
                        </div>

                        <div style={{ gridColumn: '2 / 3' }}>
                            <label className="checkbox-wrapper">
                                <input type="checkbox" name="isAsiCertified" checked={formData.isAsiCertified} onChange={handleInputChange} />
                                Certificato ASI
                            </label>
                        </div>

                        <div style={{ gridColumn: '1 / 2' }}>
                            <label className="checkbox-wrapper">
                                <input type="checkbox" name="isRoadLegal" checked={formData.isRoadLegal} onChange={handleInputChange} />
                                Idoneo alla Circolazione
                            </label>
                        </div>

                        <div style={{ gridColumn: '2 / 3' }}>
                            <label className="checkbox-wrapper">
                                <input type="checkbox" name="isVisible" checked={formData.isVisible} onChange={handleInputChange} />
                                Visibile
                            </label>
                        </div>

                        <div className="form-grid-full">
                            <h4 className="form-section-title">Prezzo e Categorie</h4>
                        </div>

                        <div>
                            <label className="form-label">Prezzo *</label>
                            <input type="number" step="0.01" className="form-control" name="price" value={formData.price} onChange={handleInputChange} placeholder="50000" required />
                        </div>

                        <div>
                            <label className="form-label">Stato Auto</label>
                            <select className="form-select" name="carStatus" value={formData.carStatus} onChange={handleInputChange}>
                                <option value="Available">Disponibile</option>
                                <option value="Reserved">Riservato</option>
                                <option value="Sold">Venduto</option>
                            </select>
                        </div>

                        <div className="form-grid-full">
                            <label className="form-label">Categorie *</label>
                            <div className="categories-box">
                                {categories.map(cat => (
                                    <label key={cat.categoryId}>
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(cat.categoryId)}
                                            onChange={() => handleCategoryToggle(cat.categoryId)}
                                        />
                                        {cat.name}
                                    </label>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowNewCategoryForm(!showNewCategoryForm)}
                                className="btn-add-category"
                            >
                                {showNewCategoryForm ? 'Annulla Nuova Categoria' : 'Nuova Categoria'}
                            </button>

                            {showNewCategoryForm && (
                                <div className="new-category-form">
                                    <input
                                        type="text"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        placeholder="Nome categoria"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddCategory}
                                        className="btn-add-category-submit"
                                    >
                                        Aggiungi
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="form-grid-full">
                            <label className="form-label">Descrizione *</label>
                            <textarea
                                className="form-control"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Descrizione dettagliata dell'auto..."
                                required
                            />
                        </div>

                        <div>
                            <label className="form-label">Immagini</label>
                            <input type="file" name="images" multiple accept="image/*" onChange={handleImagesChange} />
                        </div>

                        <div className="form-buttons">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-submit"
                            >
                                {loading ? (editingCarId ? 'Salvataggio in corso...' : 'Creazione in corso...') : (editingCarId ? 'Salva Modifiche' : 'Crea Auto')}
                            </button>
                            {editingCarId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        resetForm();
                                        setShowCreateForm(false);
                                    }}
                                    className="btn-cancel"
                                >
                                    Cancella Modifica
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => {
                                    setShowCreateForm(false);
                                    resetForm();
                                }}
                                className="btn-close-form"
                            >
                                Annulla
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <p className='cat-select'>Seleziona la categoria</p>
            <div className="categories-list d-flex align-items-center justify-content-center flex-wrap mb-5">
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
                            {getFirstImageUrlFromCar(car) && (
                                <div className="product-image" style={{ marginBottom: '0.8rem' }}>
                                    <img src={getFirstImageUrlFromCar(car)} alt={car.make} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }} />
                                </div>
                            )}
                            <h3>{car.make}</h3>
                            <p>{car.model}</p>
                            <p>${car.price}</p>
                            {isLogged &&
                                <button className="cardButton" onClick={() => onAddToCart(car)}>Aggiungi al carrello</button>
                            }
                            {!isLogged &&
                                <button className="cardButton" onClick={() => goToLogin()}>Effettua il login per acquistare</button>
                            }
                            <Link to={`/details/${car.carId}`} state={{ carId: car.carId }}>
                                <button className="cardButton">Visualizza dettagli</button>
                            </Link>
                            {isAdmin && (
                                <div className="admin-actions">
                                    <button
                                        className="cardButton"
                                        onClick={() => handleEditCar(car)}
                                        style={{ background: '#4CAF50' }}
                                    >
                                        Modifica
                                    </button>
                                    <button
                                        className="cardButton"
                                        onClick={() => handleDeleteCar(car.carId)}
                                        style={{ background: '#f44336' }}
                                    >
                                        Elimina
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                {cars.length == 0 &&
                    <h2>Ops... nessuna auto trovata per la categoria selezionata</h2>
                }
            </div>
        </div>
    );
}
