import React, { useState, useEffect } from 'react';

const ProjectForm = ({ initialData = null, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tech: '', // will be comma separated string in current state
        link: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                tech: Array.isArray(initialData.tech) ? initialData.tech.join(', ') : initialData.tech
            });
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            tech: formData.tech.split(',').map(t => t.trim()).filter(t => t)
        };
        onSubmit(payload);
    };

    return (
        <div style={{
            background: 'var(--bg-layer-2)',
            padding: '2rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            border: '1px solid var(--border-color)'
        }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>{initialData ? 'Edit Project' : 'Add New Project'}</h3>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Title</label>
                    <input
                        type="text"
                        className="form-input"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Description</label>
                    <textarea
                        className="form-input"
                        rows="3"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        required
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Technologies (comma separated)</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="React, Node.js, CSS"
                        value={formData.tech}
                        onChange={e => setFormData({ ...formData, tech: e.target.value })}
                        required
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Project Link</label>
                    <input
                        type="text"
                        className="form-input"
                        value={formData.link}
                        onChange={e => setFormData({ ...formData, link: e.target.value })}
                    />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="btn btn-primary">{initialData ? 'Update' : 'Create'}</button>
                    <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default ProjectForm;
