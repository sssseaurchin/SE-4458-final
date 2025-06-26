// src/components/Header.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <header style={{ padding: '10px', background: '#eee' }}>
            <Link to="/" style={{ marginRight: '20px' }}>
                <strong>Career Site</strong>
            </Link>

            {token ? (
                <>
                    <span>Welcome, {user?.name}</span>
                    <button style={{ marginLeft: '15px' }} onClick={handleLogout}>
                        Logout
                    </button>
                </>
            ) : (
                <Link to="/login">Login</Link>
            )}
        </header>
    );
};

export default Header;
