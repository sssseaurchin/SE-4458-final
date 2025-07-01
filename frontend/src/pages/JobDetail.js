// src/pages/JobDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import '../App.css';
import { Link } from 'react-router-dom';

const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [hasApplied, setHasApplied] = useState(false);
    const [recommendedJobs, setRecommendedJobs] = useState([]);

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
    useEffect(() => {
        if (!job || !job.city) return;

        const fetchRecommendedJobs = async () => {
            try {
                const res = await api.get('/jobs', {
                    params: {
                        city: job.city,
                        size: 5,
                        page: 1
                    }
                });

                const filtered = res.data.data
                    .filter(j => j.id !== job.id)
                    .slice(0, 3);

                setRecommendedJobs(filtered);
            } catch (err) {
                console.error('Failed to fetch recommended jobs:', err);
            }
        };

        fetchRecommendedJobs().catch((err) =>
            console.error('Unhandled error in fetchRecommendedJobs:', err)
        );
    }, [job]);

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
                        <span>{job.application_count} applicant{job.application_count === 1 ? '' : 's'}</span>
                        <span style={{fontSize: '12px', color: '#777'}}>
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
                <h3>Recommended Jobs in {job?.city}</h3>
                {recommendedJobs.length > 0 ? (
                    recommendedJobs.map(j => (
                        <div key={j.id} className="job-card">
                            <Link to={`/jobs/${j.id}`}><strong>{j.title}</strong></Link><br />
                            {j.city}, {j.country}<br />
                            <em>{j.company_name}</em>
                        </div>
                    ))
                ) : (
                    <p>No similar jobs found.</p>
                )}
            </aside>
        </div>
    );
};

export default JobDetail;
