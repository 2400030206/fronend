import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button } from 'react-bootstrap';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StudentLayout from './StudentLayout';

const StudentDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [projectCount, setProjectCount] = useState(0);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        
        api.get('/student/dashboard')
            .then(res => {
                setProjectCount(res.data.projectCount);
            })
            .catch(err => {
                if (err.response?.status === 401) navigate('/login');
            });
    }, [user, navigate]);

    if (!user) return null;

    return (
        <StudentLayout activeTab="dashboard">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-4 border-bottom">
                <h2 className="fw-bold">Welcome back, <span className="text-primary">{user.username}</span>!</h2>
                <div className="btn-toolbar mb-2 mb-md-0">
                    <Link to="/student/projects/create" className="btn btn-sm btn-outline-primary">
                        + New Project
                    </Link>
                </div>
            </div>

            <Row className="g-4 mb-5">
                <Col md={6} lg={4}>
                    <Card className="text-white bg-primary shadow-sm border-0 rounded-4 h-100">
                        <Card.Body className="p-4 d-flex flex-column justify-content-center">
                            <h6 className="card-title text-uppercase text-white-50 fw-bold">My Projects</h6>
                            <h1 className="display-4 fw-bold mb-0">{projectCount}</h1>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col md={6} lg={8}>
                    <Card className="shadow-sm border-0 rounded-4 h-100">
                        <Card.Body className="p-4">
                            <h5 className="card-title mb-3 fw-bold">Quick Actions</h5>
                            <p className="text-muted">Manage your academic profile and ensure your portfolio is up to date for potential employers and professors.</p>
                            <Link to="/student/portfolio" className="btn btn-light shadow-sm me-2">Update Portfolio</Link>
                            <Link to="/student/projects" className="btn btn-light shadow-sm">View Progress</Link>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            
            <Card className="shadow-sm border-0 rounded-4">
                <Card.Body className="p-4">
                    <h5 className="card-title fw-bold mb-3">Recent Activity Overview</h5>
                    <p className="text-muted">You can navigate through the sidebar to create your first project, update your portfolio, or add tracking milestones to existing projects.</p>
                </Card.Body>
            </Card>
        </StudentLayout>
    );
};

export default StudentDashboard;
