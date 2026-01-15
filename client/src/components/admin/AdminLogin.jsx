import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // Automatically switch between Localhost (Dev) and Relative Path (Production)
            const API_URL = import.meta.env.DEV
                ? 'http://localhost:3000/api/admin/login'
                : '/api/admin/login';

            const response = await axios.post(API_URL, { password });

            if (response.data.success) {
                localStorage.setItem('adminToken', response.data.token);

                setTimeout(() => {
                    navigate('/admin/dashboard');
                }, 100);
            } else {
                setLoading(false);
            }
        } catch (err) {
            setLoading(false);
            console.error("Login Error:", err);
            const msg = err.response?.data?.error || err.message || 'Login Failed';
            setError(`Error: ${msg}`);
        }
    };

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'var(--bg-dark)',
            color: 'var(--text-primary)'
        }}>
            <form onSubmit={handleLogin} style={{
                background: 'var(--bg-layer-2)',
                padding: '3rem',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center'
            }}>
                <h2 style={{ marginBottom: '2rem', color: 'var(--primary)' }}>Admin Login</h2>
                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        marginBottom: '1rem',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-layer-3)',
                        color: 'var(--text-primary)'
                    }}
                />
                {error && <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>}
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default AdminLogin;
