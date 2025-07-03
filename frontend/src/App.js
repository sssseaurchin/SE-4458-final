// src/App.js
import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import HomePage from './pages/HomePage';
import JobDetail from './pages/JobDetail';
import AdminPanel from './pages/AdminPanel';
import LoginPage from "./pages/LoginPage";
import Header from './components/Header';
import UserPage from './pages/UserPage';
import MyJobsPage from './pages/MyJobsPage';
import AdminLogin from "./pages/AdminLogin";
import SearchResultsPage from "./pages/SearchResultsPage";
import NotificationsPage from "./pages/NotificationsPage";
import JobAlertsPage from "./pages/JobAlertsPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
    const isAdmin = !!localStorage.getItem('adminToken');
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/jobs/:id" element={<JobDetail />} />
                <Route
                    path="/admin"
                    element={isAdmin ? <AdminPanel /> : <Navigate to="/admin/login" />}
                />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/me" element={<UserPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/alerts" element={<JobAlertsPage />} />
                <Route path="/my-jobs" element={<MyJobsPage />} />
                <Route path="/admin/login" element={<AdminLogin onLogin={() => window.location.href = '/admin'} />} />
            </Routes>
        </Router>
    );
}

export default App;
