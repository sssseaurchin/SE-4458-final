// AdminLogin.js
import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:4000/api/v1/admin';

const AdminLogin = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_BASE}/login`, {
                email,
                password
            });

            const token = res.data.token;
            localStorage.setItem('adminToken', token);
            onLogin();
        } catch (err) {
            console.error('Admin login failed:', err);
            alert('Invalid email or password.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Admin Login</h1>
            <input
                type="email"
                placeholder="Admin Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
            /><br/>
            <input
                type="password"
                placeholder="Admin Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default AdminLogin;
