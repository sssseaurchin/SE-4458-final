// src/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const [jobs, setJobs] = useState([]);
    const [position, setPosition] = useState('');
    const [city, setCity] = useState('');
    const [positionSuggestions, setPositionSuggestions] = useState([]);
    const [citySuggestions, setCitySuggestions] = useState([]);
    const [showPositionSuggestions, setShowPositionSuggestions] = useState(false);
    const [showCitySuggestions, setShowCitySuggestions] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const uniqueSearches = [];
    const seen = new Set();

    for (const item of recentSearches) {
        const key = `${item.title}__${item.city}`;
        if (!seen.has(key)) {
            seen.add(key);
            uniqueSearches.push(item);
        }
    }

    const fetchAutocomplete = (field, query, setter) => {
        if (!query) return setter([]);

        api.get(`/jobs/autocomplete?field=${field}&query=${query}`)
            .then(res => {
                // console.log(`Suggestions for ${field}:`, res.data); // DEBUG
                setter(res.data);
            })
            .catch(err => {
                console.error('Autocomplete error', err);
            });
    };


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

    const handleDeleteSearch = (itemToDelete) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        api.post('/search-history/delete', itemToDelete, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(() => {
            setRecentSearches(recentSearches.filter(item =>
                !(item.title === itemToDelete.title && item.city === itemToDelete.city)
            ));
        }).catch(err => console.error('Failed to delete search', err));
    };

    useEffect(() => {
        fetchJobs(); // initial job list

        const token = localStorage.getItem('token'); // or wherever you store it

        if (token) {
            api.get('/search-history', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => setRecentSearches(res.data))
                .catch(err => console.error('Failed to fetch recent searches', err));
        }
    }, []);


    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs({ title: position, city });
        const token = localStorage.getItem('token');

        if (token) {
            api.post('/search-history', { title: position, city }, {
                headers: { Authorization: `Bearer ${token}` }
            }).catch(() => {}); // silent
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Job Listings</h1>

            <form onSubmit={handleSearch} style={{marginBottom: '20px'}}>
                {/* Position Input with Suggestions */}
                <div style={{ position: 'relative', flex: 1 }}>
                    <input
                        type="text"
                        placeholder="Position"
                        value={position}
                        onChange={(e) => {
                            const val = e.target.value;
                            setPosition(val);
                            fetchAutocomplete('title', val, setPositionSuggestions);
                            setShowPositionSuggestions(true);
                        }}
                        onBlur={() => setTimeout(() => setShowPositionSuggestions(false), 100)}
                        onFocus={() => position && setShowPositionSuggestions(true)}
                        style={{ width: '100%' }}
                    />
                    {showPositionSuggestions && positionSuggestions.length > 0 && (
                        <ul style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            background: 'white',
                            border: '1px solid #ccc',
                            listStyle: 'none',
                            margin: 0,
                            padding: '5px 0',
                            zIndex: 5
                        }}>
                            {positionSuggestions.map((suggestion, idx) => (
                                <li
                                    key={idx}
                                    onClick={() => {
                                        setPosition(suggestion);
                                        setShowPositionSuggestions(false);
                                    }}
                                    style={{ padding: '5px 10px', cursor: 'pointer' }}
                                >
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* City Input with Suggestions */}
                <div style={{ position: 'relative', flex: 1 }}>
                    <input
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(e) => {
                            const val = e.target.value;
                            setCity(val);
                            fetchAutocomplete('city', val, setCitySuggestions);
                            setShowCitySuggestions(true);
                        }}
                        onBlur={() => setTimeout(() => setShowCitySuggestions(false), 100)}
                        onFocus={() => city && setShowCitySuggestions(true)}
                        style={{ width: '100%' }}
                    />
                    {showCitySuggestions && citySuggestions.length > 0 && (
                        <ul style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            background: 'white',
                            border: '1px solid #ccc',
                            listStyle: 'none',
                            margin: 0,
                            padding: '5px 0',
                            zIndex: 5
                        }}>
                            {citySuggestions.map((suggestion, idx) => (
                                <li
                                    key={idx}
                                    onClick={() => {
                                        setCity(suggestion);
                                        setShowCitySuggestions(false);
                                    }}
                                    style={{ padding: '5px 10px', cursor: 'pointer' }}
                                >
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <button type="submit">Search</button>
            </form>

            {/* Search History */}
            {uniqueSearches.slice(0, 5).map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                    <button
                        onClick={() => {
                            setPosition(item.title);
                            setCity(item.city);
                            fetchJobs({ title: item.title, city: item.city });
                        }}
                        style={{
                            backgroundColor: '#f0f0f0',
                            border: '1px solid #ccc',
                            borderRadius: '20px',
                            padding: '5px 12px',
                            cursor: 'pointer',
                            fontSize: '0.9em',
                            color: '#333',
                            marginRight: '6px'
                        }}
                    >
                        {item.title || 'Any'} — {item.city || 'Any'}
                    </button>
                    <button
                        onClick={() => handleDeleteSearch(item)}
                        style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            fontSize: '1.1em',
                            color: '#888',
                            cursor: 'pointer'
                        }}
                        title="Sil"
                    >
                        ×
                    </button>
                </div>
            ))}

            {/* Job Listings */}
            <ul>
                {jobs.map(job => (
                    <li key={job.id} style={{marginBottom: '15px'}}>
                        <Link to={`/jobs/${job.id}`}>
                            <strong>{job.title}</strong>
                        </Link> — {job.city}, {job.country} <br />
                        <em>{job.company_name}</em><br />
                        {job.description}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HomePage;
