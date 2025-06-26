// src/pages/UserPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserPage = () => {
    const [user, setUser] = useState({ name: '', email: '', location: '' });
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) return;

        axios.get('http://localhost:5000/api/v1/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setUser(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [token]);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        axios.put('http://localhost:5000/api/v1/auth/me', {
            name: user.name,
            location: user.location
        }, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                alert('Profile updated!');
                setUser(res.data);
                localStorage.setItem('user', JSON.stringify(res.data));
            })
            .catch(err => {
                console.error(err);
                alert('Update failed');
            });
    };

    if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>My Profile</h1>
            <p><strong>Email:</strong> {user.email}</p>
            <p>
                <strong>Name:</strong><br />
                <input name="name" value={user.name} onChange={handleChange} />
            </p>
            <p>
                <strong>Location:</strong><br />
                <input name="location" value={user.location || ''} onChange={handleChange} />
            </p>
            <button onClick={handleSave}>Save Changes</button>
        </div>
    );
};

export default UserPage;
