import React, { useEffect, useState } from 'react';
import api from '../api';
import '../App.css';

const SearchResultsPage = () => {
    const [jobs, setJobs] = useState([]);
    const [position, setPosition] = useState('');
    const [city, setCity] = useState('');
    const [positionSuggestions, setPositionSuggestions] = useState([]);
    const [citySuggestions, setCitySuggestions] = useState([]);
    const [showPositionSuggestions, setShowPositionSuggestions] = useState(false);
    const [showCitySuggestions, setShowCitySuggestions] = useState(false);

    const fetchAutocomplete = (field, query, setter) => {
        if (!query) return setter([]);
        api.get(`/jobs/autocomplete?field=${field}&query=${query}`)
            .then(res => setter(res.data))
            .catch(err => console.error('Autocomplete error', err));
    };

    const fetchJobs = () => {
        const params = new URLSearchParams();
        if (position) params.append('title', position);
        if (city) params.append('city', city);

        api.get(`/jobs?${params.toString()}`)
            .then(res => setJobs(res.data.data))
            .catch(err => console.error('Fetch error:', err));
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs();
        const token = localStorage.getItem('token');
        if (token) {
            api.post('/search-history', { title: position, city }, {
                headers: { Authorization: `Bearer ${token}` }
            }).catch(() => {});
        }
    };

    return (
        <div className="search-container">
            <aside className="filters">
                <h3>Filtrele</h3>

                <label>Şehir</label>
                <input
                    type="text"
                    name="city"
                    value={city}
                    onChange={(e) => {
                        setCity(e.target.value);
                        fetchAutocomplete('city', e.target.value, setCitySuggestions);
                        setShowCitySuggestions(true);
                    }}
                    onBlur={() => setTimeout(() => setShowCitySuggestions(false), 100)}
                    onFocus={() => city && setShowCitySuggestions(true)}
                />
                {showCitySuggestions && citySuggestions.length > 0 && (
                    <ul style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #ccc', listStyle: 'none', margin: 0, padding: '5px 0', zIndex: 5 }}>
                        {citySuggestions.map((suggestion, idx) => (
                            <li key={idx} onClick={() => { setCity(suggestion); setShowCitySuggestions(false); }} style={{ padding: '5px 10px', cursor: 'pointer' }}>{suggestion}</li>
                        ))}
                    </ul>
                )}

                <label>Çalışma Tercihi</label>
                <div>
                    <label><input type="radio" name="working_type" value="fulltime" /> İş Yerinde</label>
                    <label><input type="radio" name="working_type" value="remote" /> Remote</label>
                    <label><input type="radio" name="working_type" value="hybrid" /> Hibrit</label>
                </div>

                <label>Tarih</label>
                <div>
                    <label><input type="radio" name="postedWithin" value="" defaultChecked /> Tümü</label>
                    <label><input type="radio" name="postedWithin" value="1" /> Bugün</label>
                    <label><input type="radio" name="postedWithin" value="3" /> Son 3 gün</label>
                    <label><input type="radio" name="postedWithin" value="7" /> Son 7 gün</label>
                </div>

                <button className="filter-button" onClick={handleSearch}>Uygula</button>
            </aside>

            <main className="results">
                <form onSubmit={handleSearch} style={{marginBottom: '20px'}}>
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
                            <ul style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #ccc', listStyle: 'none', margin: 0, padding: '5px 0', zIndex: 5 }}>
                                {positionSuggestions.map((suggestion, idx) => (
                                    <li key={idx} onClick={() => { setPosition(suggestion); setShowPositionSuggestions(false); }} style={{ padding: '5px 10px', cursor: 'pointer' }}>{suggestion}</li>
                                ))}
                            </ul>
                        )}
                    </div>

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
                            <ul style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #ccc', listStyle: 'none', margin: 0, padding: '5px 0', zIndex: 5 }}>
                                {citySuggestions.map((suggestion, idx) => (
                                    <li key={idx} onClick={() => { setCity(suggestion); setShowCitySuggestions(false); }} style={{ padding: '5px 10px', cursor: 'pointer' }}>{suggestion}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <button type="submit">Search</button>
                </form>

                <ul className="job-list">
                    {jobs.map(job => (
                        <li key={job.id} className="job-card">
                            <a href={`/jobs/${job.id}`}>{job.title}</a>
                            <div>{job.city}, {job.country} — {job.working_type}</div>
                            <div className="company-name">{job.company_name}</div>
                            <div className="desc">{job.description}</div>
                        </li>
                    ))}
                </ul>
            </main>
        </div>
    );
};

export default SearchResultsPage;
