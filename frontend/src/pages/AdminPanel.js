// src/pages/AdminPanel.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';


const AdminPanel = () => {
    const [job, setJob] = useState({
        title: '',
        description: '',
        city: '',
        country: '',
        working_type: 'fulltime',
        company_name: ''
    });
    const [jobs, setJobs] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [applications] = useState({});

    const navigate = useNavigate();
    const token = localStorage.getItem('adminToken');

    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [totalJobs, setTotalJobs] = useState(0);
    const [totalPages, setTotalPages] = useState(1);


    useEffect(() => {
        if (!token) {
            navigate('/admin/login');
            return;
        }
        fetchAllJobs();
    }, [token, navigate, page, size]);

    const fetchAllJobs = () => {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('size', size);
        api.get(`/jobs?${params.toString()}`)
            .then(res => {
                setJobs(res.data.data);
                setTotalJobs(res.data.total);
                setTotalPages(Math.ceil(res.data.total / size));
            })
            .catch(err => console.error('Failed to fetch jobs:', err));
    };

    // const fetchApplications = (jobId) => {
    //     console.log('Admin Token (fetchApplications):', token);
    //     axios.get(`http://localhost:3001/api/v1/jobs/admin/${jobId}/applications`, {
    //         headers: { Authorization: `Bearer ${token}` }
    //     })
    //         .then(res => {
    //             setApplications(prev => ({ ...prev, [jobId]: res.data.applications }));
    //         })
    //         .catch(err => {
    //             console.error('Error fetching applications:', err);
    //             alert('Could not fetch applications.');
    //         });
    // };

    const handleChange = (e) => {
        setJob({ ...job, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Admin Token (handleSubmit):', token);

        const url = editingId ? `/admin/jobs/${editingId}` : `/admin/jobs`;
        const method = editingId ? 'put' : 'post';

        api({
            method,
            url,
            data: job,
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
            .then(() => {
                alert(`Job ${editingId ? 'updated' : 'created'} successfully!`);
                setJob({ title: '', description: '', city: '', country: '', working_type: 'fulltime', company_name: '' });
                setEditingId(null);
                fetchAllJobs();
            })
            .catch(err => {
                console.error(err);
                alert('Error saving job');
            });
    };

    const handleEdit = (job) => {
        setJob(job);
        setEditingId(job.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id) => {
        if (!id) return alert("Invalid job ID");

        const confirmed = window.confirm('Are you sure you want to delete this job?');
        if (!confirmed) return;

        console.log('Admin Token (handleDelete):', token);
        api.delete(`/admin/jobs/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(() => {
                alert('Job deleted.');
                fetchAllJobs();
            })
            .catch(err => {
                console.error('Error deleting job:', err);
                alert('Error deleting job');
            });
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/');
    };

    return (
        <div style={{padding: '20px'}}>
            <h1>Admin Panel – {editingId ? 'Edit Job' : 'Add Job'}</h1>
            <button onClick={handleLogout} style={{float: 'right'}}>Logout</button>

            <form onSubmit={handleSubmit}>
                <input name="title" placeholder="Job Title" value={job.title} onChange={handleChange} required/><br/>
                <input name="company_name" placeholder="Company Name" value={job.company_name} onChange={handleChange}
                       required/><br/>
                <input name="city" placeholder="City" value={job.city} onChange={handleChange} required/><br/>
                <input name="country" placeholder="Country" value={job.country} onChange={handleChange} required/><br/>
                <select name="working_type" value={job.working_type} onChange={handleChange}>
                    <option value="fulltime">Full-Time</option>
                    <option value="parttime">Part-Time</option>
                    <option value="remote">Remote</option>
                </select><br/>
                <textarea name="description" placeholder="Job Description" value={job.description}
                          onChange={handleChange} required/><br/>
                <button type="submit">{editingId ? 'Update Job' : 'Post Job'}</button>
            </form>

            <hr/>

            <h2>Existing Jobs</h2>
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

            <ul>
                {jobs.map(j => (
                    <li key={j.id} style={{marginBottom: '10px'}}>
                        <strong>{j.title}</strong> — {j.city}, {j.country}
                        <button style={{marginLeft: '10px'}} onClick={() => handleEdit(j)}>Edit</button>
                        <button style={{marginLeft: '10px'}} onClick={() => handleDelete(j.id)}>Delete</button>
                        {/*<button style={{ marginLeft: '10px' }} onClick={() => fetchApplications(j.id)}>View Applications</button>*/}

                        {applications[j.id] && (
                            <ul style={{marginTop: '5px', marginLeft: '20px'}}>
                                {applications[j.id].length === 0 ? (
                                    <li>No applications yet.</li>
                                ) : (
                                    applications[j.id].map((app, idx) => (
                                        <li key={idx}>User
                                            ID: {app.user_id} — {new Date(app.applied_at).toLocaleString()}</li>
                                    ))
                                )}
                            </ul>
                        )}
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
        </div>
    );
};

export default AdminPanel;
