import React, { useEffect, useState, useCallback, useRef} from 'react';
import api from '../api';
import '../App.css';
import { useLocation } from 'react-router-dom';

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
    const location = useLocation();
    const hasInitializedFromURL = useRef(false);
    const cityTimeoutRef = useRef(null);
    const positionTimeoutRef = useRef(null);

    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10); // optional to make user-adjustable

    const [totalJobs, setTotalJobs] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const fetchAutocomplete = (field, query, setter) => {
        if (!query) return setter([]);
        api.get(`/jobs/autocomplete?field=${field}&query=${query}`)
            .then(res => setter(res.data))
            .catch(err => console.error('Autocomplete error', err));
    };

    const fetchJobs = useCallback(() => {
        const params = new URLSearchParams();

        if (position) params.append('title', position);
        selectedCities.forEach(city => params.append('city', city));
        workingTypes.forEach(type => params.append('working_type', type));
        if (postedWithin) params.append('postedWithin', postedWithin);

        params.append('page', page);
        params.append('size', size);

        api.get(`/jobs?${params.toString()}`)
            .then(res => {
                setJobs(res.data.data);
                setTotalJobs(res.data.total);
                setTotalPages(Math.ceil(res.data.total / size));
            })
            .catch(err => console.error('Fetch error:', err));
    }, [position, selectedCities, workingTypes, postedWithin, page, size]);

    useEffect(() => {
        if (hasInitializedFromURL.current) return;

        const params = new URLSearchParams(location.search);
        const title = params.get('title');
        const cityParam = params.get('city');

        if (title) setPosition(title);
        if (cityParam) setSelectedCities([cityParam]);

        if (title || cityParam) {
            fetchJobs();
        }

        hasInitializedFromURL.current = true;

        return () => {
            clearTimeout(cityTimeoutRef.current);
            clearTimeout(positionTimeoutRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

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
                <div className="autocomplete-wrapper">
                    <input
                        type="text"
                        name="city"
                        value={city}
                        onChange={(e) => {
                            const val = e.target.value;
                            setCity(val);
                            if (cityTimeoutRef.current) clearTimeout(cityTimeoutRef.current);
                            if (val.trim()) {
                                cityTimeoutRef.current = setTimeout(() => {
                                    fetchAutocomplete('city', val, setCitySuggestions);
                                    setShowCitySuggestions(true);
                                }, 300); // 300ms delay
                            } else {
                                setCitySuggestions([]);
                            }
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

                {/*<label>Çalışma Tercihi</label>*/}
                <div className="filter-group">
                    {['fulltime', 'remote', 'hybrid'].map(type => (
                        <div className="filter-row" key={type}>
                            <span>{type === 'fulltime' ? 'İş Yerinde' : type === 'remote' ? 'Remote' : 'Hibrit'}</span>
                            <input
                                type="checkbox"
                                value={type}
                                checked={workingTypes.includes(type)}
                                onChange={() => toggleWorkingType(type)}
                            />
                        </div>
                    ))}
                </div>

                {/*<label>Tarih</label>*/}
                <div className="filter-group">
                    {['', '1', '3', '7'].map(value => (
                        <div className="filter-row" key={value}>
                            <span>
                                {value === '' ? 'Tümü' : value === '1' ? 'Bugün' : `Son ${value} gün`}
                            </span>
                            <input
                                type="radio"
                                name="postedWithin"
                                value={value}
                                checked={postedWithin === value}
                                onChange={(e) => setPostedWithin(e.target.value)}
                            />
                        </div>
                    ))}
                </div>

                {/*<button className="filter-button" onClick={handleSearch}>Uygula</button>*/}
            </aside>

            <main className="results">
                <form onSubmit={handleSearch} style={{marginBottom: '20px'}}>
                    <div className="autocomplete-wrapper">
                        <input
                            type="text"
                            placeholder="Position"
                            value={position}
                            onChange={(e) => {
                                const val = e.target.value;
                                setPosition(val);
                                if (positionTimeoutRef.current) clearTimeout(positionTimeoutRef.current);
                                if (val.trim()) {
                                    positionTimeoutRef.current = setTimeout(() => {
                                        fetchAutocomplete('title', val, setPositionSuggestions);
                                        setShowPositionSuggestions(true);
                                    }, 300); // 300ms delay
                                } else {
                                    setPositionSuggestions([]);
                                }
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
                    {/*<button type="submit">Search</button>*/}
                </form>

                {selectedCities.length > 0 && (
                    <div style={{marginBottom: '10px'}}>
                        <strong>Seçili Şehirler:</strong>
                        <div style={{display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px'}}>
                            {selectedCities.map((item, idx) => (
                                <div key={idx} style={{display: 'flex', alignItems: 'center'}}>
                                    <span style={{
                                        backgroundColor: '#f0f0f0',
                                        border: '1px solid #ccc',
                                        borderRadius: '20px',
                                        padding: '5px 12px',
                                        fontSize: '0.9em',
                                        color: '#333'
                                    }}>{item}</span>
                                    <button
                                        onClick={() =>
                                            setSelectedCities(prev => prev.filter(c => c !== item))
                                        }
                                        style={{
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                            fontSize: '1.1em',
                                            color: '#888',
                                            cursor: 'pointer',
                                            marginLeft: '-8px'
                                        }}
                                    >×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="jobs-per-page-container">
                    <span className="jobs-per-page-label">Jobs per page:</span>
                    {[5, 10, 20, 50].map(val => (
                        <button
                            key={val}
                            onClick={() => {
                                setSize(val);
                                setPage(1);
                            }}
                            className={`jobs-per-page-button ${size === val ? 'active' : ''}`}
                        >
                            {val}
                        </button>
                    ))}
                </div>
                <p><strong>{totalJobs}</strong> jobs found</p>
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
                <div style={{marginTop: '20px'}}>
                    <button onClick={() => setPage(prev => Math.max(prev - 1, 1))} disabled={page === 1}>
                        Previous
                    </button>
                    <span style={{margin: '0 10px'}}>Page {page}</span>
                    <button onClick={() => setPage(prev => prev + 1)} disabled={page >= totalPages}>
                        Next
                    </button>
                </div>
            </main>
        </div>
    );
};

export default SearchResultsPage;
