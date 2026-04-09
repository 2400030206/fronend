import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Table, Badge } from 'react-bootstrap';
import api from '../../services/api';
import StudentLayout from './StudentLayout';
import { useAuth } from '../../context/AuthContext';

const ProjectList = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        api.get('/student/projects')
            .then(res => {
                setProjects(res.data);
            })
            .catch(err => console.error(err));
    }, [user, navigate]);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Pending': return <Badge bg="warning" text="dark" className="px-3 mt-1 py-2 rounded-pill">Pending Approval</Badge>;
            case 'Approved': return <Badge bg="success" className="px-3 py-2 mt-1 rounded-pill">Approved</Badge>;
            case 'Rejected': return <Badge bg="danger" className="px-3 py-2 mt-1 rounded-pill">Rejected</Badge>;
            default: return <Badge bg="secondary" className="px-3 py-2 mt-1 rounded-pill">{status}</Badge>;
        }
    };

    return (
        <StudentLayout activeTab="projects">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-4 border-bottom">
                <h2 className="fw-bold">My Projects</h2>
                <Link to="/student/projects/create" className="btn btn-primary rounded-pill px-4 shadow-sm">+ Add Project</Link>
            </div>

            <Card className="shadow-sm border-0 rounded-4">
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <Table hover className="mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="px-4 py-3">Project Title</th>
                                    <th className="py-3">Technology Stack</th>
                                    <th className="py-3">Status</th>
                                    <th className="py-3 text-end px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center py-5 text-muted">You haven't created any projects yet. Start by creating one!</td>
                                    </tr>
                                ) : (
                                    projects.map(project => (
                                        <tr key={project.id}>
                                            <td className="px-4 py-3 align-middle fw-bold">{project.projectTitle}</td>
                                            <td className="py-3 align-middle">{project.technology}</td>
                                            <td className="py-3 align-middle">
                                                {getStatusBadge(project.status)}
                                            </td>
                                            <td className="py-3 px-4 text-end align-middle">
                                                <Link to={`/student/projects/${project.id}`} className="btn btn-sm btn-outline-primary px-3 rounded-pill shadow-sm">
                                                    View Details & Progress
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>
        </StudentLayout>
    );
};

export default ProjectList;
