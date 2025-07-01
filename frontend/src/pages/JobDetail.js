// src/pages/JobDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import '../App.css';

const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [hasApplied, setHasApplied] = useState(false);

    useEffect(() => {
        api.get(`/jobs/${id}`)
            .then(res => setJob(res.data))
            .catch(err => console.error('Error fetching job:', err));

        const token = localStorage.getItem('token');
        if (token) {
            api.get('/jobs/applied', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => {
                    const appliedIds = res.data.map(j => j.id.toString());
                    if (appliedIds.includes(id)) setHasApplied(true);
                })
                .catch(err => console.error('Error checking applied jobs:', err));
        }
    }, [id]);

    const handleApply = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Please log in to apply for jobs.");
            navigate('/login');
            return;
        }

        api.post(`/jobs/${id}/apply`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                alert("Successfully applied!");
                setHasApplied(true);
            })
            .catch(() => {
                alert("Could not apply. Please try again.");
            });
    };

    if (!job) return <div style={{ padding: '20px' }}>Loading...</div>;

    return (
        <div className="job-detail-container">
            <div className="job-main">
                <div className="job-detail-header">
                    <h2>{job.title}</h2>
                    <div className="job-meta">
                        <span><strong>{job.company_name}</strong></span>
                        <span>{job.city}, {job.country} — {job.working_type}</span>
                        <span style={{ fontSize: '12px', color: '#777' }}>
                            Last updated: {new Date(job.updatedAt).toLocaleDateString('tr-TR')}
                        </span>
                    </div>
                    <button
                        className="apply-button"
                        onClick={handleApply}
                        disabled={hasApplied}
                    >
                        {hasApplied ? "Applied" : "Apply"}
                    </button>
                </div>

                <div className="job-description">
                    <h4>Description</h4>
                    <p>{job.description}</p>
                </div>
            </div>

            <aside className="job-sidebar">
                <h4>Recommended for you</h4>
                {/*FIX HERE*/}
                <div className="job-card">
                    <a className="job-title-link" href="/jobs/1">Frontend Developer</a>
                    <div>Izmir, Turkey — Remote</div>
                    <div className="company-name">ExampleCorp</div>
                </div>
                <div className="job-card">
                    <a className="job-title-link" href="/jobs/2">Backend Engineer</a>
                    <div>Izmir, Turkey — Hybrid</div>
                    <div className="company-name">CodeFactory</div>
                </div>
                <div className="job-card">
                    <a className="job-title-link" href="/jobs/3">Fullstack Dev</a>
                    <div>Izmir, Turkey — Fulltime</div>
                    <div className="company-name">DevWorks</div>
                </div>
            </aside>
        </div>
    );
};

export default JobDetail;
