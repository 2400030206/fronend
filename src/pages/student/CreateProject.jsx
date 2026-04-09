import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Form, Button } from 'react-bootstrap';
import api from '../../services/api';
import StudentLayout from './StudentLayout';

const CreateProject = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        projectTitle: '',
        description: '',
        technology: '',
        githubLink: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/student/projects', formData);
            navigate('/student/projects');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <StudentLayout activeTab="create">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-4 border-bottom">
                <h2 className="fw-bold">Create New Project</h2>
            </div>

            <Card className="shadow-sm border-0 rounded-4 col-lg-8">
                <Card.Body className="p-4">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold">Project Title</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="projectTitle" 
                                value={formData.projectTitle} 
                                onChange={handleChange} 
                                required 
                                placeholder="e.g., E-commerce Website" 
                            />
                        </Form.Group>
                        
                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold">Technology Stack</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="technology" 
                                value={formData.technology} 
                                onChange={handleChange} 
                                required 
                                placeholder="e.g., Java, Spring Boot, React" 
                            />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted fw-bold">Project Description</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                name="description" 
                                value={formData.description} 
                                onChange={handleChange} 
                                rows={4} 
                                required 
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="text-muted fw-bold">GitHub Repository Link (Optional)</Form.Label>
                            <Form.Control 
                                type="url" 
                                name="githubLink" 
                                value={formData.githubLink} 
                                onChange={handleChange} 
                                placeholder="https://github.com/username/repo" 
                            />
                        </Form.Group>
                        
                        <Button variant="primary" type="submit" className="py-2 px-4 rounded-pill">Submit Project Idea</Button>
                        <Link to="/student/dashboard" className="btn btn-light py-2 px-4 rounded-pill ms-2 shadow-sm">Cancel</Link>
                    </Form>
                </Card.Body>
            </Card>
        </StudentLayout>
    );
};

export default CreateProject;
