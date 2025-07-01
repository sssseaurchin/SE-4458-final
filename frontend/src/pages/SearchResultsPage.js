import React, { useEffect, useState } from 'react';
import api from '../api';
import '../App.css';

const SearchResultsPage = () => {
    const [jobs, setJobs] = useState([]);
    const [position, setPosition] = useState('');
    const [city, setCity] = useState('');
    const [workingTypes, setWorkingTypes] = useState([]);
    const [postedWithin, setPostedWithin] = useState('');
    const [positionSuggestions, setPositionSuggestions] = useState([]);
    const [citySuggestions, setCitySuggestions] = useState([]);
    const [showPositionSuggestions, setShowPositionSuggestions] = useState(false);
    const [showCitySuggestions, setShowCitySuggestions] = useState(false);
    const [selectedCities, setSelectedCities] = useState([]);

    const fetchAutocomplete = (field, query, setter) => {
        if (!query) return setter([]);
        api.get(`/jobs/autocomplete?field=${field}&query=${query}`)
            .then(res => setter(res.data))
            .catch(err => console.error('Autocomplete error', err));
    };

    const fetchJobs = () => {
        const params = new URLSearchParams();

        if (position) params.append('title', position);
        selectedCities.forEach(city => params.append('city', city));
        workingTypes.forEach(type => params.append('working_type', type));
        if (postedWithin) params.append('postedWithin', postedWithin);

        api.get(`/jobs?${params.toString()}`)
            .then(res => setJobs(res.data.data))
            .catch(err => console.error('Fetch error:', err));
    };

    useEffect(() => {
        fetchJobs();
    }, [selectedCities, workingTypes, postedWithin]);

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

    const toggleWorkingType = (value) => {
        setWorkingTypes(prev =>
            prev.includes(value)
                ? prev.filter(v => v !== value)
                : [...prev, value]
        );
    };

    return (
        <div className="search-container">
            <aside className="filters">
                <h3>Filtrele</h3>

                <label>Şehir</label>
                <div style={{position: 'relative'}}>
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
                        <ul className="suggestions">
                            {citySuggestions.map((suggestion, idx) => (
                                <li key={idx} onClick={() => {
                                    if (!selectedCities.includes(suggestion)) {
                                        setSelectedCities(prev => [...prev, suggestion]);
                                    }
                                    setCity('');
                                    setShowCitySuggestions(false);
                                }}>
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <label>Çalışma Tercihi</label>
                <div className="filter-group">
                <div className="filter-row">
                        <span>İş Yerinde</span>
                        <input type="checkbox" value="fulltime" checked={workingTypes.includes('fulltime')}
                               onChange={() => toggleWorkingType('fulltime')}/>
                    </div>
                    <div className="filter-row">
                        <span>Remote</span>
                        <input type="checkbox" value="remote" checked={workingTypes.includes('remote')}
                               onChange={() => toggleWorkingType('remote')}/>
                    </div>
                    <div className="filter-row">
                        <span>Hibrit</span>
                        <input type="checkbox" value="hybrid" checked={workingTypes.includes('hybrid')}
                               onChange={() => toggleWorkingType('hybrid')}/>
                    </div>
                </div>


                <label>Tarih</label>
                <div className="filter-group">
                    <div className="filter-row">
                        <span>Tümü</span>
                        <input type="radio" name="postedWithin" value="" checked={postedWithin === ''}
                               onChange={(e) => setPostedWithin(e.target.value)}/>
                    </div>
                    <div className="filter-row">
                        <span>Bugün</span>
                        <input type="radio" name="postedWithin" value="1" checked={postedWithin === '1'}
                               onChange={(e) => setPostedWithin(e.target.value)}/>
                    </div>
                    <div className="filter-row">
                        <span>Son 3 gün</span>
                        <input type="radio" name="postedWithin" value="3" checked={postedWithin === '3'}
                               onChange={(e) => setPostedWithin(e.target.value)}/>
                    </div>
                    <div className="filter-row">
                        <span>Son 7 gün</span>
                        <input type="radio" name="postedWithin" value="7" checked={postedWithin === '7'}
                               onChange={(e) => setPostedWithin(e.target.value)}/>
                    </div>
                </div>


                <button className="filter-button" onClick={handleSearch}>Uygula</button>
            </aside>

            <main className="results">
                <form onSubmit={handleSearch} style={{marginBottom: '20px'}}>
                    <div style={{position: 'relative', width: '60%', marginBottom: '10px'}}>
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
                        />
                        {showPositionSuggestions && positionSuggestions.length > 0 && (
                            <ul className="suggestions">
                                {positionSuggestions.map((suggestion, idx) => (
                                    <li key={idx} onClick={() => {
                                        setPosition(suggestion);
                                        setShowPositionSuggestions(false);
                                    }}>
                                    {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <button type="submit">Search</button>
                </form>
                {/*Search Filters*/}
                {selectedCities.length > 0 && (
                    <div style={{ marginBottom: '10px' }}>
                        <strong>Seçili Şehirler:</strong>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                            {selectedCities.map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{
                                    backgroundColor: '#f0f0f0',
                                    border: '1px solid #ccc',
                                    borderRadius: '20px',
                                    padding: '5px 12px',
                                    fontSize: '0.9em',
                                    color: '#333'
                                }}>{item}</span>
                                    <button
                                        onClick={() => {
                                            const updated = selectedCities.filter(c => c !== item);
                                            setSelectedCities(updated);
                                            fetchJobs(updated);
                                        }}
                                        style={{
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                            fontSize: '1.1em',
                                            color: '#888',
                                            cursor: 'pointer',
                                            marginLeft: '-8px'
                                        }}
                                    >×</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <ul className="job-list">
                    {jobs.map(job => (
                        <li key={job.id} className="job-card">
                            <a className="job-title-link" href={`/jobs/${job.id}`}>{job.title}</a>
                            <div>{job.city}, {job.country} — {job.working_type}</div>
                            <div className="company-name">{job.company_name}</div>
                            <div className="desc">{job.description}</div>
                            <div style={{fontSize: '12px', color: '#777', marginTop: '4px'}}>
                                Updated: {new Date(job.updatedAt).toLocaleDateString('tr-TR')}
                            </div>
                        </li>
                    ))}
                </ul>
            </main>
        </div>
    );
};

export default SearchResultsPage;
