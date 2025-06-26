// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import JobDetail from './pages/JobDetail';
import AdminPanel from './pages/AdminPanel';
import LoginPage from "./pages/LoginPage";
import Header from './components/Header';
import UserPage from './pages/UserPage';
import MyJobsPage from './pages/MyJobsPage';

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/jobs/:id" element={<JobDetail />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/me" element={<UserPage />} />
                <Route path="/my-jobs" element={<MyJobsPage />} />
            </Routes>
        </Router>
    );
}

export default App;
