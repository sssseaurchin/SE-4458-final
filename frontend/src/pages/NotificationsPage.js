import React, { useEffect, useState } from 'react';
import api from '../api';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await api.get(`/notifications/user/${user.id}`);
                // console.log('Received notifications:', res.data);
                setNotifications((res.data.data || []).reverse());
            } catch (err) {
                console.error('Error fetching notifications:', err);
            }
        };

        if (user?.id) fetchNotifications();
    }, [user]);

    return (
        <div className="notifications-page">
            <h1>Your Notifications</h1>
            {notifications.length === 0 ? (
                <p>No notifications yet.</p>
            ) : (
                <ul>
                    {notifications.map((n, idx) => (
                        <li key={idx}>
                            <strong>{new Date(n.timestamp).toLocaleString()}</strong>:
                            {" "}
                            {n.matchedJobs && n.matchedJobs.length > 0 ? (
                                n.matchedJobs.map((job, i) => (
                                    <span key={i}>
                        <a href={`/jobs/${job.id}`} style={{color: '#007c26'}}>
                            {job.title}
                        </a>
                                        {i < n.matchedJobs.length - 1 && ', '}
                    </span>
                                ))
                            ) : (
                                'No jobs listed.'
                            )}
                            {` in ${n.alert.city}`}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NotificationsPage;
