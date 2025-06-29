// AdminLogin.js
import React, { useState } from 'react';

const AdminLogin = ({ onLogin }) => {
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === 'adminpass') {
            localStorage.setItem('adminToken', 'supersecrettoken123');
            onLogin();
        } else {
            alert('Wrong password!');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="password" placeholder="Admin Password" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="submit">Login</button>
        </form>
    );
};

export default AdminLogin;
