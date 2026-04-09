import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';

const StudentLayout = ({ children, activeTab }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    const navLinks = [
        { path: '/student/dashboard', label: 'Dashboard', id: 'dashboard' },
        { path: '/student/projects/create', label: 'Create New Project', id: 'create' },
        { path: '/student/projects', label: 'My Projects', id: 'projects' },
        { path: '/student/portfolio', label: 'My Portfolio', id: 'portfolio' },
        // Instead of a button, adding logout as a link here for simplicity in our generic Sidebar
        { path: '/login', label: 'Logout 🚪', id: 'logout', action: handleLogout }
    ];

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* The Navbar is now globally defined in App.jsx */}
            <div className="container-fluid flex-grow-1">
                <div className="row h-100">
                    <Sidebar links={navLinks} activeTab={activeTab} title="Student Portal" />

                    {/* Main Content Area */}
                    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-5 py-4">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default StudentLayout;
