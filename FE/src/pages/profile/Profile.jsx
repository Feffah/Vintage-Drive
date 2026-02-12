import { useState, useEffect } from 'react';
import './Profile.css';
import { getUserById, updateUser } from '../../services/apiService';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [editedUser, setEditedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (!userId) {
            navigate('/login');
            return;
        }

        const fetchUserData = async () => {
            try {
                setLoading(true);
                const userData = await getUserById(userId);
                setUser(userData);
            } catch (err) {
                console.error(err);
                setError('Errore nel caricamento dei dati del profilo');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId, navigate]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('it-IT', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleEditClick = () => {
        setEditedUser({ ...user });
        setIsEditing(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditedUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateUser(userId, editedUser);
            setUser(editedUser);
            setIsEditing(false);
            setError('');
            alert('Profilo aggiornato con successo!');
        } catch (err) {
            console.error(err);
            setError('Errore nell\'aggiornamento del profilo');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditedUser(null);
        setIsEditing(false);
        setError('');
    };

    if (loading) {
        return <div className="profile-container"><p>Caricamento...</p></div>;
    }

    if (error) {
        return <div className="profile-container"><p className="error-message">{error}</p></div>;
    }

    if (!user) {
        return <div className="profile-container"><p>Nessun dato trovato</p></div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <h1 className="profile-title">Profilo Personale</h1>
                    <div className="profile-avatar">{user.name?.charAt(0)}{user.surname?.charAt(0)}</div>
                </div>

                <div className="profile-content">
                    {error && <p className="error-message">{error}</p>}

                    <div className="profile-section">
                        <h2 className="section-title">Dati Personali</h2>
                        <div className="profile-grid">
                            <div className="profile-item">
                                <label className="profile-label">Nome</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        className="profile-input"
                                        value={editedUser?.name || ''}
                                        onChange={handleEditChange}
                                    />
                                ) : (
                                    <p className="profile-value">{user.name || 'N/A'}</p>
                                )}
                            </div>
                            <div className="profile-item">
                                <label className="profile-label">Cognome</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="surname"
                                        className="profile-input"
                                        value={editedUser?.surname || ''}
                                        onChange={handleEditChange}
                                    />
                                ) : (
                                    <p className="profile-value">{user.surname || 'N/A'}</p>
                                )}
                            </div>
                            <div className="profile-item">
                                <label className="profile-label">Nome Utente</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="userName"
                                        className="profile-input"
                                        value={editedUser?.userName || ''}
                                        onChange={handleEditChange}
                                    />
                                ) : (
                                    <p className="profile-value">{user.userName || 'N/A'}</p>
                                )}
                            </div>
                            <div className="profile-item">
                                <label className="profile-label">Email</label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        className="profile-input"
                                        value={editedUser?.email || ''}
                                        onChange={handleEditChange}
                                    />
                                ) : (
                                    <p className="profile-value">{user.email || 'N/A'}</p>
                                )}
                            </div>
                            <div className="profile-item">
                                <label className="profile-label">Data di Nascita</label>
                                {isEditing ? (
                                    <input
                                        type="date"
                                        name="birthday"
                                        className="profile-input"
                                        value={editedUser?.birthday?.split('T')[0] || ''}
                                        onChange={handleEditChange}
                                    />
                                ) : (
                                    <p className="profile-value">{formatDate(user.birthday)}</p>
                                )}
                            </div>
                            <div className="profile-item">
                                <label className="profile-label">Telefono</label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        name="phone"
                                        className="profile-input"
                                        value={editedUser?.phone || ''}
                                        onChange={handleEditChange}
                                    />
                                ) : (
                                    <p className="profile-value">{user.phone || 'N/A'}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="profile-section">
                        <h2 className="section-title">Indirizzo</h2>
                        <div className="profile-grid">
                            <div className="profile-item">
                                <label className="profile-label">Indirizzo</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="adress"
                                        className="profile-input"
                                        value={editedUser?.adress || ''}
                                        onChange={handleEditChange}
                                    />
                                ) : (
                                    <p className="profile-value">{user.adress || 'N/A'}</p>
                                )}
                            </div>
                            <div className="profile-item">
                                <label className="profile-label">Città</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="city"
                                        className="profile-input"
                                        value={editedUser?.city || ''}
                                        onChange={handleEditChange}
                                    />
                                ) : (
                                    <p className="profile-value">{user.city || 'N/A'}</p>
                                )}
                            </div>
                            <div className="profile-item">
                                <label className="profile-label">CAP</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="postalCode"
                                        className="profile-input"
                                        value={editedUser?.postalCode || ''}
                                        onChange={handleEditChange}
                                    />
                                ) : (
                                    <p className="profile-value">{user.postalCode || 'N/A'}</p>
                                )}
                            </div>
                            <div className="profile-item">
                                <label className="profile-label">Paese</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="country"
                                        className="profile-input"
                                        value={editedUser?.country || ''}
                                        onChange={handleEditChange}
                                    />
                                ) : (
                                    <p className="profile-value">{user.country || 'N/A'}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="profile-actions">
                        {!isEditing ? (
                            <button className="btn-edit" onClick={handleEditClick}>
                                Modifica Profilo
                            </button>
                        ) : (
                            <>
                                <button 
                                    className="btn-save" 
                                    onClick={handleSave}
                                    disabled={saving}
                                >
                                    {saving ? 'Salvataggio in corso...' : 'Salva'}
                                </button>
                                <button 
                                    className="btn-cancel" 
                                    onClick={handleCancel}
                                    disabled={saving}
                                >
                                    Annulla
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
