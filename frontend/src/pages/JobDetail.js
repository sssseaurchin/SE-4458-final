// src/pages/JobDetail.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

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
                    const appliedIds = res.data.map(j => j.id);
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
        <div style={{padding: '20px'}}>
            <h1>{job.title}</h1>
            <p><strong>Company:</strong> {job.company_name}</p>
            <p><strong>Location:</strong> {job.city}, {job.country}</p>
            <p><strong>Type:</strong> {job.working_type}</p>
            <p><strong>Description:</strong></p>
            <p>{job.description}</p>
            <button onClick={handleApply} disabled={hasApplied}>
                {hasApplied ? "Already Applied" : "Apply"}
            </button>
        </div>
    );
};

export default JobDetail;
