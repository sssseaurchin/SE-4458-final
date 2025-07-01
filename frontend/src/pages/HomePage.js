// src/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';

const HomePage = () => {
    const [position, setPosition] = useState('');
    const [city, setCity] = useState('');
    const [positionSuggestions, setPositionSuggestions] = useState([]);
    const [citySuggestions, setCitySuggestions] = useState([]);
    const [showPositionSuggestions, setShowPositionSuggestions] = useState(false);
    const [showCitySuggestions, setShowCitySuggestions] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const [suggestedJobs, setSuggestedJobs] = useState([]);
    const [detectedCity, setDetectedCity] = useState('');

    const navigate = useNavigate();

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
            .then(res => setter(res.data))
            .catch(err => console.error('Autocomplete error', err));
    };

    const fetchSuggestedJobs = async (city) => {
        const params = new URLSearchParams({ city, size: 5, page: 1 });

        try {
            const res = await api.get(`/jobs?${params.toString()}`);
            if (res.data.data.length > 0) {
                setSuggestedJobs(res.data.data);
            } else {
                const fallback = await api.get(`/jobs?size=5&page=1`);
                setSuggestedJobs(fallback.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch suggested jobs:', err);
        }
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
        const fallbackCity = "Izmir";
        const token = localStorage.getItem('token');

        const getCityFromProfileOrLocation = async () => {
            let cityToUse = '';

            if (token) {
                try {
                    const res = await api.get('/auth/me', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    console.log('User profile city:', res.data?.city);
                    if (res.data?.city) {
                        cityToUse = res.data?.location || '';
                    }
                } catch (err) {
                    console.warn("Couldn't get city from profile:", err);
                }
            }

            if (cityToUse) {
                setDetectedCity(cityToUse);
                await fetchSuggestedJobs(cityToUse);
            } else {
                navigator.geolocation.getCurrentPosition(
                    async (pos) => {
                        try {
                            const { latitude, longitude } = pos.coords;
                            const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                            const data = await geoRes.json();
                            const geoCity = data.address?.city || data.address?.town || data.address?.village;

                            if (geoCity) {
                                setDetectedCity(geoCity);
                                await fetchSuggestedJobs(geoCity);
                            } else {
                                setDetectedCity(fallbackCity);
                                await fetchSuggestedJobs(fallbackCity);
                            }
                        } catch {
                            setDetectedCity(fallbackCity);
                            await fetchSuggestedJobs(fallbackCity);
                        }
                    },
                    () => {
                        fetchSuggestedJobs(); // random
                    }
                );
            }
        };

        getCityFromProfileOrLocation()
            .then(() => {
                if (token) {
                    api.get('/search-history', {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                        .then(res => setRecentSearches(res.data))
                        .catch(err => console.error('Failed to fetch recent searches', err));
                }
            })
            .catch(err => console.error("Error in location/profile logic:", err));
    }, []);


    const handleSearch = (e) => {
        e.preventDefault();

        const query = new URLSearchParams();
        if (position) query.append('title', position);
        if (city) query.append('city', city);

        const token = localStorage.getItem('token');
        if (token) {
            api.post('/search-history', { title: position, city }, {
                headers: { Authorization: `Bearer ${token}` }
            }).catch(() => {});
        }

        navigate(`/search?${query.toString()}`);
    };

    return (
        <div style={{padding: '20px'}}>
            <h1 style={{backgroundColor : '#007c26', color : "white", padding: '10px 30px',borderRadius: '8px'}}>Welcome to the Site!</h1>

            <form onSubmit={handleSearch} style={{marginBottom: '20px'}}>
                <div style={{position: 'relative', marginBottom: '10px'}}>
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
                        style={{width: '96%'}}
                    />
                    {showPositionSuggestions && positionSuggestions.length > 0 && (
                        <ul style={{
                            position: 'absolute', top: '100%', left: 0, right: 0, background: 'white',
                            border: '1px solid #ccc', listStyle: 'none', margin: 0, padding: '5px 0', zIndex: 5
                        }}>
                            {positionSuggestions.map((suggestion, idx) => (
                                <li
                                    key={idx}
                                    onClick={() => {
                                        setPosition(suggestion);
                                        setShowPositionSuggestions(false);
                                    }}
                                    style={{padding: '5px 10px', cursor: 'pointer'}}
                                >
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div style={{position: 'relative', marginBottom: '10px'}}>
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
                        style={{width: '96%'}}
                    />
                    {showCitySuggestions && citySuggestions.length > 0 && (
                        <ul style={{
                            position: 'absolute', top: '100%', left: 0, right: 0, background: 'white',
                            border: '1px solid #ccc', listStyle: 'none', margin: 0, padding: '5px 0', zIndex: 5
                        }}>
                            {citySuggestions.map((suggestion, idx) => (
                                <li
                                    key={idx}
                                    onClick={() => {
                                        setCity(suggestion);
                                        setShowCitySuggestions(false);
                                    }}
                                    style={{padding: '5px 10px', cursor: 'pointer'}}
                                >
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <button type="submit">Search</button>
            </form>

            {/* Recent Searches */}
            <div className="recent-searches-container">
                {uniqueSearches.length > 0 && (
                    <>
                        <h3>Son Aramalarım</h3>
                        {uniqueSearches.slice(0, 5).map((item, idx) => (
                            <div key={idx} style={{display: 'flex', alignItems: 'center', marginBottom: '6px'}}>
                                <button
                                    onClick={() => {
                                        setPosition(item.title);
                                        setCity(item.city);
                                        navigate(`/search?title=${item.title}&city=${item.city}`);
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
                    </>
                )}
            </div>
            {/* Location-Based Job Suggestions */}
            <h3>{detectedCity ? `Jobs in ${detectedCity}` : 'Featured Jobs'}</h3>
            <div className="home-job-card-container">
                    {suggestedJobs.map(job => (
                        <div key={job.id} style={{marginBottom: '15px'}} className="home-job-card">
                            <Link to={`/jobs/${job.id}`}>
                                <strong>{job.title}</strong>
                            </Link> — {job.city}, {job.country} <br/>
                            <em>{job.company_name}</em><br/>

                        </div>
                    ))}
                </div>
            </div>
            );
            };

            export default HomePage;
