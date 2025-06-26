// src/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import api from '../api';

const HomePage = () => {
    const [jobs, setJobs] = useState([]);
    const [position, setPosition] = useState('');
    const [city, setCity] = useState('');

    const fetchJobs = (filters = {}) => {
        const params = new URLSearchParams({
            size: 5,
            page: 1,
            ...(filters.title && { title: filters.title }),
            ...(filters.city && { city: filters.city }),
        });

        api.get(`/jobs?${params.toString()}`)
            .then(response => {
                console.log('Filtered jobs:', response.data);
                setJobs(response.data.data);
            })
            .catch(error => console.error('Error fetching jobs:', error));
    };

    useEffect(() => {
        fetchJobs(); // initial load
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs({ title: position, city });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Job Listings</h1>

            <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Position"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    style={{ marginRight: '10px' }}
                />
                <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={{ marginRight: '10px' }}
                />
                <button type="submit">Search</button>
            </form>

            <ul>
                {jobs.map(job => (
                    <li key={job.id} style={{ marginBottom: '15px' }}>
                        <strong>{job.title}</strong> — {job.city}, {job.country} <br />
                        <em>{job.company_name}</em><br />
                        {job.description}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HomePage;
