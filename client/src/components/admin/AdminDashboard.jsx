import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProjectForm from './ProjectForm';
import ExperienceForm from './ExperienceForm';
import ToastNotification from '../ui/ToastNotification';
import ConfirmModal from '../ui/ConfirmModal';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('projects');
    const [projects, setProjects] = useState([]);
    const [experience, setExperience] = useState([]);
    const [loading, setLoading] = useState(true);

    // UI States
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [toast, setToast] = useState(null); // { message, type }
    const [modal, setModal] = useState({ isOpen: false, id: null, type: null });

    const checkAuth = () => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            window.location.href = '/admin';
        }
        return token;
    };

    const getAuthHeader = () => ({
        headers: { 'Authorization': localStorage.getItem('adminToken') }
    });

    const fetchData = async () => {
        try {
            const [projRes, expRes] = await Promise.all([
                axios.get('/api/admin/projects'),
                axios.get('/api/admin/experience')
            ]);
            setProjects(projRes.data);
            setExperience(expRes.data);
        } catch (error) {
            console.error("Error fetching admin data", error);
            showToast('Failed to fetch data', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
        fetchData();
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin';
    };

    // --- CRUD OPERATIONS ---

    const handleCreate = async (data) => {
        try {
            const endpoint = activeTab === 'projects' ? '/api/admin/projects' : '/api/admin/experience';
            const res = await axios.post(endpoint, data, getAuthHeader());

            if (activeTab === 'projects') setProjects(res.data.data);
            else setExperience(res.data.data);

            showToast(`${activeTab === 'projects' ? 'Project' : 'Experience'} added successfully!`);
            setIsFormOpen(false);
        } catch (error) {
            showToast('Failed to create item', 'error');
        }
    };

    const handleUpdate = async (data) => {
        try {
            const endpoint = activeTab === 'projects'
                ? `/api/admin/projects/${editingItem.id}`
                : `/api/admin/experience/${editingItem.id}`;

            const res = await axios.put(endpoint, data, getAuthHeader());

            if (activeTab === 'projects') setProjects(res.data.data);
            else setExperience(res.data.data);

            showToast('Item updated successfully!');
            setIsFormOpen(false);
            setEditingItem(null);
        } catch (error) {
            showToast('Failed to update item', 'error');
        }
    };

    const handleDelete = async () => {
        try {
            const endpoint = modal.type === 'projects'
                ? `/api/admin/projects/${modal.id}`
                : `/api/admin/experience/${modal.id}`;

            const res = await axios.delete(endpoint, getAuthHeader());

            if (modal.type === 'projects') setProjects(res.data.data);
            else setExperience(res.data.data);

            showToast('Item deleted successfully!');
            setModal({ isOpen: false, id: null, type: null });
        } catch (error) {
            showToast('Failed to delete item', 'error');
        }
    };

    // --- UI HELPERS ---

    const openAddForm = () => {
        setEditingItem(null);
        setIsFormOpen(true);
    };

    const openEditForm = (item) => {
        setEditingItem(item);
        setIsFormOpen(true);
    };

    const openDeleteModal = (id, type) => {
        setModal({ isOpen: true, id, type });
    };

    if (loading) return <div style={{ padding: '2rem', color: 'white', textAlign: 'center' }}>Loading Dashboard...</div>;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text-primary)', padding: '2rem' }}>
            {toast && <ToastNotification message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <ConfirmModal
                isOpen={modal.isOpen}
                title="Confirm Deletion"
                message="Are you sure you want to delete this item? This action cannot be undone."
                onConfirm={handleDelete}
                onCancel={() => setModal({ isOpen: false, id: null, type: null })}
            />

            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h1 style={{ color: 'var(--primary)' }}>Admin Dashboard</h1>
                <div>
                    <a href="/" className="btn btn-secondary" style={{ marginRight: '1rem', textDecoration: 'none' }}>View Site</a>
                    <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
                </div>
            </header>

            {!isFormOpen ? (
                <>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                        <button
                            onClick={() => setActiveTab('projects')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: activeTab === 'projects' ? 'var(--primary)' : 'var(--text-secondary)',
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                borderBottom: activeTab === 'projects' ? '2px solid var(--primary)' : 'none',
                                paddingBottom: '0.5rem'
                            }}
                        >
                            Projects
                        </button>
                        <button
                            onClick={() => setActiveTab('experience')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: activeTab === 'experience' ? 'var(--primary)' : 'var(--text-secondary)',
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                borderBottom: activeTab === 'experience' ? '2px solid var(--primary)' : 'none',
                                paddingBottom: '0.5rem'
                            }}
                        >
                            Experience
                        </button>
                    </div>

                    <div className="dashboard-content">
                        {activeTab === 'projects' && (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <h2>Manage Projects</h2>
                                    <button onClick={openAddForm} className="btn btn-primary">+ Add Project</button>
                                </div>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {projects.map(p => (
                                        <li key={p.id} style={{
                                            background: 'var(--bg-layer-2)',
                                            padding: '1.5rem',
                                            marginBottom: '1rem',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            border: '1px solid var(--border-color)'
                                        }}>
                                            <div>
                                                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{p.title}</h3>
                                                <p style={{ margin: '0.5rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{p.description.substring(0, 60)}...</p>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button onClick={() => openEditForm(p)} className="btn btn-secondary" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>Edit</button>
                                                <button onClick={() => openDeleteModal(p.id, 'projects')} className="btn btn-secondary" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)', fontSize: '0.9rem', padding: '0.5rem 1rem' }}>Delete</button>
                                            </div>
                                        </li>
                                    ))}
                                    {projects.length === 0 && <p>No projects found.</p>}
                                </ul>
                            </div>
                        )}

                        {activeTab === 'experience' && (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <h2>Manage Experience</h2>
                                    <button onClick={openAddForm} className="btn btn-primary">+ Add Experience</button>
                                </div>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {experience.map(e => (
                                        <li key={e.id} style={{
                                            background: 'var(--bg-layer-2)',
                                            padding: '1.5rem',
                                            marginBottom: '1rem',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            border: '1px solid var(--border-color)'
                                        }}>
                                            <div>
                                                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{e.company}</h3>
                                                <p style={{ margin: '0.2rem 0', fontWeight: 'bold', color: 'var(--primary)' }}>{e.role}</p>
                                                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{e.year}</p>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button onClick={() => openEditForm(e)} className="btn btn-secondary" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>Edit</button>
                                                <button onClick={() => openDeleteModal(e.id, 'experience')} className="btn btn-secondary" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)', fontSize: '0.9rem', padding: '0.5rem 1rem' }}>Delete</button>
                                            </div>
                                        </li>
                                    ))}
                                    {experience.length === 0 && <p>No experience entries found.</p>}
                                </ul>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                // Form View
                <div>
                    <button onClick={() => { setIsFormOpen(false); setEditingItem(null); }} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        ← Back to Dashboard
                    </button>
                    {activeTab === 'projects' ? (
                        <ProjectForm
                            initialData={editingItem}
                            onSubmit={editingItem ? handleUpdate : handleCreate}
                            onCancel={() => { setIsFormOpen(false); setEditingItem(null); }}
                        />
                    ) : (
                        <ExperienceForm
                            initialData={editingItem}
                            onSubmit={editingItem ? handleUpdate : handleCreate}
                            onCancel={() => { setIsFormOpen(false); setEditingItem(null); }}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
