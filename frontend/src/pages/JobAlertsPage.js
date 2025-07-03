//src/pages/JobAlertsPage.js
import React, { useEffect, useState } from 'react';
import api from '../api';

const JobAlertsPage = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [alerts, setAlerts] = useState([]);
    const [city, setCity] = useState('');
    const [keywords, setKeywords] = useState('');

    const fetchAlerts = async () => {
        const res = await api.get(`/notifications/alerts/${user.id}`);
        setAlerts(res.data);
    };

    const createAlert = async (e) => {
        e.preventDefault();
        const keywordArray = keywords.split(',').map(s => s.trim()).filter(Boolean);
        if (!city || keywordArray.length === 0) return;

        await api.post('/notifications/alerts', {
            userId: user.id,
            city,
            keywords: keywordArray
        });
        setCity('');
        setKeywords('');
        fetchAlerts();
    };

    const deleteAlert = async (alert) => {
        await api.delete(`/notifications/alerts/${user.id}`, {
            data: { keywords: alert.keywords, city: alert.city }
        });
        fetchAlerts();
    };
    // console.log("Loaded user from localStorage:", user); // DEBUG

    useEffect(() => {
        if (user?.id) fetchAlerts();
    }, [user]);

    return (
        <div className="app-container">
            <h2>Manage Job Alerts</h2>
            <form onSubmit={createAlert}>
                <input
                    type="text"
                    value={keywords}
                    onChange={e => setKeywords(e.target.value)}
                    placeholder="Keywords (comma-separated)"
                />
                <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="City"
                />
                <button type="submit">Add Alert</button>
            </form>

            <h3>My Alerts</h3>
            {alerts.length === 0 ? (
                <p>No alerts yet.</p>
            ) : (
                <ul>
                    {alerts.map((alert, idx) => (
                        <li key={idx}>
                            <strong>{alert.keywords.join(', ')}</strong> in <em>{alert.city}</em>
                            <button onClick={() => deleteAlert(alert)} style={{ marginLeft: '10px' }}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default JobAlertsPage;
