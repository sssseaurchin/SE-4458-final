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
        navigate('/');
    };

    return (
        <div className="header">
            <header>
                <Link to="/" style={{ marginRight: '20px' }}>
                    <strong>Career Site</strong>
                </Link>

                {token ? (
                    <>
                        <span>
                            Welcome, <Link to="/me">{user?.name}</Link>
                        </span>
                        <button style={{marginLeft: '15px'}} onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </header>
        </div>
    );
};

export default Header;
