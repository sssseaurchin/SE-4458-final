// src/pages/MyJobsPage.js
import React, { useEffect, useState } from 'react';
import api from '../api';

const MyJobsPage = () => {
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/jobs/applied', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => setJobs(res.data))
            .catch(err => {
                console.error(err);
                setError('Could not fetch applied jobs.');
            });
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h1>My Applications</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {jobs.map(job => (
                    <li key={job.id} style={{ marginBottom: '15px' }}>
                        <strong>{job.title}</strong> — {job.city}, {job.country}<br />
                        <em>{job.company_name}</em><br />
                        {job.description}
                    </li>
                ))}
            </ul>
            {jobs.length === 0 && !error && <p>You have not applied to any jobs yet.</p>}
        </div>
    );
};

export default MyJobsPage;
