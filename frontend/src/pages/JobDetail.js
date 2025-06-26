// src/pages/JobDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

const JobDetail = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);

    useEffect(() => {
        api.get(`/jobs/${id}`)
            .then(response => setJob(response.data))
            .catch(error => console.error('Error fetching job:', error));
    }, [id]);

    if (!job) return <div style={{ padding: '20px' }}>Loading...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>{job.title}</h1>
            <p><strong>Company:</strong> {job.company_name}</p>
            <p><strong>Location:</strong> {job.city}, {job.country}</p>
            <p><strong>Type:</strong> {job.working_type}</p>
            <p><strong>Description:</strong></p>
            <p>{job.description}</p>
            <button>Apply</button>
        </div>
    );
};

export default JobDetail;
