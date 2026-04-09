import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Card, Table, Badge, Form, Button } from 'react-bootstrap';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    
    // State to handle inline feedback form
    const [reviewData, setReviewData] = useState({ id: null, status: 'Approved', feedback: '' });

    useEffect(() => {
        if (!user || user.role !== 'ROLE_ADMIN') {
            navigate('/login');
            return;
        }

        fetchProjects();
    }, [user, navigate]);

    const fetchProjects = async () => {
        try {
            const res = await api.get('/admin/projects');
            setProjects(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleReviewClick = (project) => {
        setReviewData({
            id: project.id,
            status: project.status === 'Pending' ? 'Approved' : project.status,
            feedback: project.feedback || ''
        });
    };

    const handleReviewChange = (e) => {
        setReviewData({ ...reviewData, [e.target.name]: e.target.value });
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/admin/projects/${reviewData.id}/review`, {
                status: reviewData.status,
                feedback: reviewData.feedback
            });
            setReviewData({ id: null, status: 'Approved', feedback: '' }); // close inline form
            fetchProjects(); // refresh list
        } catch (err) {
            console.error(err);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Pending': return <Badge bg="warning" text="dark" className="px-3 py-2 rounded-pill">Pending</Badge>;
            case 'Approved': return <Badge bg="success" className="px-3 py-2 rounded-pill">Approved</Badge>;
            case 'Rejected': return <Badge bg="danger" className="px-3 py-2 rounded-pill">Rejected</Badge>;
            default: return <Badge bg="secondary" className="px-3 py-2 rounded-pill">{status}</Badge>;
        }
    };

    if (!user || user.role !== 'ROLE_ADMIN') return null;

    return (
        <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
            <Container fluid className="py-4 px-md-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold text-dark">Student Projects Overview</h2>
                    <div className="bg-white px-4 py-2 rounded shadow-sm border">
                        <span className="text-muted fw-bold small text-uppercase">Total Submissions</span>
                        <span className="ms-3 fs-5 fw-bold text-primary">{projects.length}</span>
                    </div>
                </div>

                <Card className="shadow-sm border-0 rounded-4">
                    <Card.Body className="p-0">
                        <div className="table-responsive">
                            <Table hover className="mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th className="px-4 py-3">Student</th>
                                        <th className="py-3">Project Title</th>
                                        <th className="py-3">Technology</th>
                                        <th className="py-3">Status</th>
                                        <th className="py-3 px-4 text-center">Action / Review</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center py-5 text-muted">No projects have been submitted yet.</td>
                                        </tr>
                                    ) : (
                                        projects.map(project => (
                                            <React.Fragment key={project.id}>
                                                <tr>
                                                    <td className="px-4 py-3 align-middle">
                                                        <div className="fw-bold text-dark">{project.user.username}</div>
                                                        <small className="text-muted">{project.user.email}</small>
                                                    </td>
                                                    <td className="py-3 align-middle fw-bold text-primary">{project.projectTitle}</td>
                                                    <td className="py-3 align-middle"><span className="text-muted small border rounded px-2 py-1 bg-light">{project.technology}</span></td>
                                                    <td className="py-3 align-middle">{getStatusBadge(project.status)}</td>
                                                    <td className="py-3 px-4 text-center align-middle">
                                                        <Button 
                                                            variant="outline-primary" 
                                                            size="sm" 
                                                            className="rounded-pill px-3 shadow-sm"
                                                            onClick={() => handleReviewClick(project)}
                                                        >
                                                            Review
                                                        </Button>
                                                    </td>
                                                </tr>
                                                
                                                {/* Inline Review Form (Expandable Row) */}
                                                {reviewData.id === project.id && (
                                                    <tr className="bg-light border-bottom border-primary border-3">
                                                        <td colSpan="5" className="px-4 py-4">
                                                            <div className="bg-white p-4 rounded shadow-sm border">
                                                                <h6 className="fw-bold mb-3 d-flex justify-content-between border-bottom pb-2">
                                                                    <span>Reviewing: {project.projectTitle}</span>
                                                                    <Button variant="close" size="sm" onClick={() => setReviewData({ id: null })}></Button>
                                                                </h6>
                                                                
                                                                <div className="mb-3">
                                                                    <span className="text-muted small fw-bold text-uppercase d-block mb-1">Student's Description</span>
                                                                    <p className="mb-0 text-dark p-3 bg-light rounded text-dark fs-6" style={{ whiteSpace: 'pre-line' }}>{project.description}</p>
                                                                </div>
                                                                
                                                                <Form onSubmit={handleReviewSubmit}>
                                                                    <div className="row g-3">
                                                                        <div className="col-md-3">
                                                                            <Form.Group>
                                                                                <Form.Label className="small fw-bold">Update Status</Form.Label>
                                                                                <Form.Select name="status" value={reviewData.status} onChange={handleReviewChange}>
                                                                                    <option value="Pending">Pending</option>
                                                                                    <option value="Approved">Approve</option>
                                                                                    <option value="Rejected">Reject</option>
                                                                                </Form.Select>
                                                                            </Form.Group>
                                                                        </div>
                                                                        <div className="col-md-7">
                                                                            <Form.Group>
                                                                                <Form.Label className="small fw-bold">Feedback / Remarks</Form.Label>
                                                                                <Form.Control 
                                                                                    type="text" 
                                                                                    name="feedback" 
                                                                                    value={reviewData.feedback} 
                                                                                    onChange={handleReviewChange} 
                                                                                    placeholder="Provide actionable feedback to the student..." 
                                                                                />
                                                                            </Form.Group>
                                                                        </div>
                                                                        <div className="col-md-2 d-flex align-items-end">
                                                                            <Button variant="primary" type="submit" className="w-100 shadow-sm fw-bold">Save Review</Button>
                                                                        </div>
                                                                    </div>
                                                                </Form>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default AdminDashboard;
