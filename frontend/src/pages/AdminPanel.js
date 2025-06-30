// src/pages/AdminPanel.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:4000/api/v1/admin';

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
    const [applications, setApplications] = useState({});

    const navigate = useNavigate();
    const token = localStorage.getItem('adminToken');

    useEffect(() => {
        if (!token) {
            navigate('/admin/login');
            return;
        }
        fetchAllJobs();
    }, [token, navigate]);

    const fetchAllJobs = () => {
        axios.get('http://localhost:3001/api/v1/jobs')
            .then(res => setJobs(res.data.data))
            .catch(err => console.error('Failed to fetch jobs:', err));
    };

    const fetchApplications = (jobId) => {
        console.log('Admin Token (fetchApplications):', token);
        axios.get(`http://localhost:3001/api/v1/jobs/admin/${jobId}/applications`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                setApplications(prev => ({ ...prev, [jobId]: res.data.applications }));
            })
            .catch(err => {
                console.error('Error fetching applications:', err);
                alert('Could not fetch applications.');
            });
    };

    const handleChange = (e) => {
        setJob({ ...job, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Admin Token (handleSubmit):', token);

        const url = editingId ? `${API_BASE}/jobs/${editingId}` : `${API_BASE}/jobs`;
        const method = editingId ? 'put' : 'post';

        axios({
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
        axios.delete(`${API_BASE}/jobs/${id}`, {
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
        navigate('/admin/login');
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Admin Panel – {editingId ? 'Edit Job' : 'Add Job'}</h1>
            <button onClick={handleLogout} style={{ float: 'right' }}>Logout</button>

            <form onSubmit={handleSubmit}>
                <input name="title" placeholder="Job Title" value={job.title} onChange={handleChange} required /><br />
                <input name="company_name" placeholder="Company Name" value={job.company_name} onChange={handleChange} required /><br />
                <input name="city" placeholder="City" value={job.city} onChange={handleChange} required /><br />
                <input name="country" placeholder="Country" value={job.country} onChange={handleChange} required /><br />
                <select name="working_type" value={job.working_type} onChange={handleChange}>
                    <option value="fulltime">Full-Time</option>
                    <option value="parttime">Part-Time</option>
                    <option value="remote">Remote</option>
                </select><br />
                <textarea name="description" placeholder="Job Description" value={job.description} onChange={handleChange} required /><br />
                <button type="submit">{editingId ? 'Update Job' : 'Post Job'}</button>
            </form>

            <hr />

            <h2>Existing Jobs</h2>
            <ul>
                {jobs.map(j => (
                    <li key={j.id} style={{ marginBottom: '10px' }}>
                        <strong>{j.title}</strong> — {j.city}, {j.country}
                        <button style={{ marginLeft: '10px' }} onClick={() => handleEdit(j)}>Edit</button>
                        <button style={{ marginLeft: '10px' }} onClick={() => handleDelete(j.id)}>Delete</button>
                        <button style={{ marginLeft: '10px' }} onClick={() => fetchApplications(j.id)}>View Applications</button>

                        {applications[j.id] && (
                            <ul style={{ marginTop: '5px', marginLeft: '20px' }}>
                                {applications[j.id].length === 0 ? (
                                    <li>No applications yet.</li>
                                ) : (
                                    applications[j.id].map((app, idx) => (
                                        <li key={idx}>User ID: {app.user_id} — {new Date(app.applied_at).toLocaleString()}</li>
                                    ))
                                )}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminPanel;
