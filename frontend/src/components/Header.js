import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const Header = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchNotifications = async () => {
            if (user?.id) {
                try {
                    const res = await api.get(`/notifications/user/${user.id}`);
                    const all = res.data?.data || [];
                    setNotifications(all.slice(0, 5)); // last 5 only
                } catch (err) {
                    console.error('Failed to fetch notifications:', err);
                }
            }
        };

        fetchNotifications();
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="header">
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <Link to="/" style={{ marginRight: '20px' }}>
                        <strong>Career Site</strong>
                    </Link>
                </div>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {token && (
                        <div style={{ position: 'relative', marginRight: '20px' }} ref={dropdownRef}>
                            <span
                                style={{ cursor: 'pointer', fontWeight: 'bold' }}
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                🔔 Alerts
                            </span>
                            {dropdownOpen && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '30px',
                                        right: 0,
                                        background: '#fff',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        width: '270px',
                                        maxHeight: '300px',
                                        overflowY: 'auto',
                                        zIndex: 10,
                                        padding: '10px',
                                    }}
                                >
                                    {notifications.length === 0 ? (
                                        <p style={{ color: 'black' }}>No notifications yet.</p>
                                    ) : (
                                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                            {notifications.map((notif, index) => (
                                                <li key={index} style={{ marginBottom: '8px', color: "black"}}>
                                                    {notif.jobId ? (
                                                        <Link to={`/jobs/${notif.jobId}`} style={{ color: '#007c26' }}>
                                                            {new Date(notif.timestamp).toLocaleString()}: {notif.matchedJobs?.join(', ')}
                                                        </Link>
                                                    ) : (
                                                        <span>
                                                            {new Date(notif.timestamp).toLocaleString()}: {notif.message || 'Job alert!'}
                                                        </span>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    <hr />
                                    <Link to="/notifications" style={{ color: '#007c26' }}>See all notifications</Link>
                                    <br />
                                    <Link to="/alerts" style={{ color: '#007c26' }}>Manage alerts</Link>
                                </div>
                            )}
                        </div>
                    )}

                    {token ? (
                        <>
                            <span>
                                Welcome, <Link to="/me">{user?.name}</Link>
                            </span>
                            <button style={{ marginLeft: '15px' }} onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login">Login</Link>

                    )}
                </div>
            </header>
        </div>
    );
};

export default Header;
