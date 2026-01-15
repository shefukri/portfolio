import React, { useState, useEffect } from 'react';

const ExperienceForm = ({ initialData = null, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        company: '',
        role: '',
        year: '',
        location: '',
        description: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div style={{
            background: 'var(--bg-layer-2)',
            padding: '2rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            border: '1px solid var(--border-color)'
        }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>{initialData ? 'Edit Experience' : 'Add New Experience'}</h3>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Company</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.company}
                            onChange={e => setFormData({ ...formData, company: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Role</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.role}
                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Year / Duration</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. 2023-2024"
                            value={formData.year}
                            onChange={e => setFormData({ ...formData, year: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Location</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.location}
                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                            required
                        />
                    </div>
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

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="btn btn-primary">{initialData ? 'Update' : 'Create'}</button>
                    <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default ExperienceForm;
