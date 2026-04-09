import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Pending': return <Badge bg="warning" text="dark" className="px-3 py-2 rounded-pill">Pending Approval</Badge>;
            case 'Approved': return <Badge bg="success" className="px-3 py-2 rounded-pill">Approved</Badge>;
            case 'Rejected': return <Badge bg="danger" className="px-3 py-2 rounded-pill">Rejected</Badge>;
            default: return <Badge bg="secondary" className="px-3 py-2 rounded-pill">{status}</Badge>;
        }
    };

    return (
        <Card className="shadow-sm border-0 rounded-4 h-100 feature-card">
            <Card.Body className="p-4 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="fw-bold text-primary mb-0">{project.projectTitle}</h5>
                    {getStatusBadge(project.status)}
                </div>
                <p className="text-muted small mb-2"><span className="fw-bold text-dark">Tech:</span> {project.technology}</p>
                {project.githubLink && (
                    <p className="small mb-2 text-truncate">
                        <span className="fw-bold text-dark">Code:</span> <a href={project.githubLink} target="_blank" rel="noreferrer" className="text-decoration-none">{project.githubLink}</a>
                    </p>
                )}
                <Card.Text className="text-muted flex-grow-1" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {project.description}
                </Card.Text>
                
                <div className="mt-3 pt-3 border-top text-end">
                    <Button 
                        as={Link} 
                        to={`/student/projects/${project.id}`} 
                        variant="outline-primary" 
                        size="sm" 
                        className="rounded-pill px-3 shadow-sm w-100"
                    >
                        View Details & Progress
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default ProjectCard;
