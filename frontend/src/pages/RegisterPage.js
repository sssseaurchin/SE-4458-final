import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const RegisterPage = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        location: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await api.post('/auth/register', form);
            const { token, user } = res.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            navigate('/'); // redirect to homepage after registration
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Registration failed.');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <form onSubmit={handleRegister}>
                <h1>Register</h1>
                <input
                    style={{ width: '96%' }}
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                /><br/>
                <input
                    style={{ width: '96%' }}
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                /><br/>
                <input
                    style={{ width: '96%' }}
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                /><br/>
                <input
                    style={{ width: '96%' }}
                    type="text"
                    name="location"
                    placeholder="City (optional)"
                    value={form.location}
                    onChange={handleChange}
                /><br/>
                <button type="submit">Register</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default RegisterPage;
