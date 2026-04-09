import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Form, Button, Badge } from 'react-bootstrap';
import api from '../../services/api';
import StudentLayout from './StudentLayout';
import { useAuth } from '../../context/AuthContext';
import MilestoneTracker from '../../components/MilestoneTracker';

const ProjectProgress = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [project, setProject] = useState(null);
    const [milestones, setMilestones] = useState([]);
    
    const [newMilestone, setNewMilestone] = useState({
        milestoneName: '',
        progress: '',
        deadline: ''
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        fetchProjectData();
    }, [id, user, navigate]);

    const fetchProjectData = async () => {
        try {
            const res = await api.get(`/student/projects/${id}`);
            setProject(res.data.project);
            setMilestones(res.data.milestones);
        } catch (err) {
            console.error(err);
            navigate('/student/projects'); // Redirect if access denied or not found
        }
    };

    const handleMilestoneChange = (e) => {
        setNewMilestone({ ...newMilestone, [e.target.name]: e.target.value });
    };

    const handleMilestoneSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/student/projects/${id}/milestones`, newMilestone);
            setNewMilestone({ milestoneName: '', progress: '', deadline: '' });
            fetchProjectData(); // Refresh the list
        } catch (err) {
            console.error(err);
        }
    };

    if (!project) return <StudentLayout activeTab="projects"><p>Loading...</p></StudentLayout>;

    return (
        <StudentLayout activeTab="projects">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-4 border-bottom">
                <div>
                    <Link to="/student/projects" className="text-decoration-none text-muted mb-2 d-block">&larr; Back to Projects</Link>
                    <h2 className="fw-bold">{project.projectTitle}</h2>
                </div>
                
                <div className="text-end">
                    {project.status === 'Pending' && <Badge bg="warning" text="dark" className="fs-6 px-3 py-2 rounded-pill">Pending Approval</Badge>}
                    {project.status === 'Approved' && <Badge bg="success" className="fs-6 px-3 py-2 rounded-pill">Approved</Badge>}
                    {project.status === 'Rejected' && <Badge bg="danger" className="fs-6 px-3 py-2 rounded-pill">Rejected</Badge>}
                </div>
            </div>

            <Row className="g-4">
                <Col md={5}>
                    <Card className="shadow-sm border-0 rounded-4 mb-4">
                        <Card.Body className="p-4">
                            <h5 className="fw-bold mb-3 border-bottom pb-2">Details</h5>
                            <p className="mb-1 text-muted small">Technology Stack</p>
                            <p className="fw-bold">{project.technology}</p>
                            
                            <p className="mb-1 mt-4 text-muted small">Description</p>
                            <p>{project.description}</p>
                            
                            {project.feedback && (
                                <div className="mt-4 p-3 bg-light rounded border-start border-4 border-info">
                                    <p className="mb-1 text-info small fw-bold">Admin Feedback</p>
                                    <p className="mb-0 fst-italic">{project.feedback}</p>
                                </div>
                            )}

                            {project?.githubLink && (
                                <div className="mt-4">
                                    <h6 className="fw-bold text-muted mb-1 text-uppercase small">Repository</h6>
                                    <a href={project.githubLink} target="_blank" rel="noreferrer" className="text-decoration-none btn btn-outline-dark btn-sm rounded-pill px-3 shadow-sm mt-1">
                                        <i className="bi bi-github me-2"></i> View on GitHub
                                    </a>
                                </div>
                            )}
                        </Card.Body>
                    </Card>

                    <Card className="shadow-sm border-0 rounded-4">
                        <Card.Body className="p-4 bg-light rounded-4">
                            <h5 className="fw-bold mb-3">Add Milestone</h5>
                            <Form onSubmit={handleMilestoneSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small text-muted">Milestone Name</Form.Label>
                                    <Form.Control type="text" name="milestoneName" value={newMilestone.milestoneName} onChange={handleMilestoneChange} required placeholder="e.g., Database Design" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small text-muted">Progress (%)</Form.Label>
                                    <Form.Control type="number" name="progress" value={newMilestone.progress} onChange={handleMilestoneChange} min="0" max="100" required placeholder="e.g., 50" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small text-muted">Deadline</Form.Label>
                                    <Form.Control type="date" name="deadline" value={newMilestone.deadline} onChange={handleMilestoneChange} required />
                                </Form.Group>
                                <Button variant="primary" type="submit" className="w-100 rounded-pill">Save Milestone</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={7}>
                    <Card className="shadow-sm border-0 rounded-4 h-100 bg-light">
                        <Card.Body className="p-4">
                            <h5 className="card-title fw-bold border-bottom pb-3 mb-4">Milestone Tracker</h5>
                            <MilestoneTracker milestones={milestones} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </StudentLayout>
    );
};

export default ProjectProgress;
