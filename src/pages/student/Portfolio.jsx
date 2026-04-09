import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import api from '../../services/api';
import StudentLayout from './StudentLayout';
import { useAuth } from '../../context/AuthContext';

const Portfolio = () => {
    const { user } = useAuth();
    const [portfolio, setPortfolio] = useState({ skills: '', achievements: '' });

    useEffect(() => {
        if (!user) return;
        
        api.get('/student/portfolio')
            .then(res => {
                const data = res.data.portfolio;
                if(data) {
                    setPortfolio({
                        skills: data.skills || '',
                        achievements: data.achievements || ''
                    });
                }
            })
            .catch(err => console.error(err));
    }, [user]);

    const handleChange = (e) => {
        setPortfolio({ ...portfolio, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/student/portfolio', portfolio);
            alert("Portfolio updated successfully!");
        } catch (err) {
            console.error("Error updating portfolio", err);
        }
    };

    if (!user) return null;

    return (
        <StudentLayout activeTab="portfolio">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-4 border-bottom">
                <h2 className="fw-bold">My Digital Portfolio</h2>
            </div>

            <Row className="g-4">
                <Col md={6}>
                    <Card className="shadow-sm border-0 rounded-4">
                        <Card.Body className="p-4">
                            <h5 className="fw-bold mb-3 border-bottom pb-2">Update Information</h5>
                            
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-4">
                                    <Form.Label className="text-muted small fw-bold">Skills</Form.Label>
                                    <Form.Control 
                                        as="textarea" 
                                        name="skills" 
                                        value={portfolio.skills} 
                                        onChange={handleChange} 
                                        rows={4} 
                                        placeholder="E.g., Java, Spring Boot, React, Communication..." 
                                    />
                                    <Form.Text className="text-muted">Comma separated list of your best skills.</Form.Text>
                                </Form.Group>
                                
                                <Form.Group className="mb-4">
                                    <Form.Label className="text-muted small fw-bold">Achievements & Certifications</Form.Label>
                                    <Form.Control 
                                        as="textarea" 
                                        name="achievements" 
                                        value={portfolio.achievements} 
                                        onChange={handleChange} 
                                        rows={6} 
                                        placeholder="E.g., 1st Prize Hackathon 2023, AWS Cloud Practitioner..." 
                                    />
                                </Form.Group>
                                
                                <Button variant="primary" type="submit" className="rounded-pill px-4 shadow-sm w-100">Save Portfolio Updates</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="shadow-sm border-0 rounded-4 h-100 bg-primary text-white text-center">
                        <Card.Body className="p-5 d-flex flex-column justify-content-center">
                            <div className="mb-4">
                                <div className="d-inline-flex border border-4 border-light rounded-circle align-items-center justify-content-center mb-3" style={{ width: '100px', height: '100px' }}>
                                    <span className="fs-1 fw-bold">{user.username ? user.username.substring(0, 1).toUpperCase() : 'U'}</span>
                                </div>
                                <h3 className="fw-bold mb-0">{user.username}</h3>
                                <p className="text-white-50">{user.email}</p>
                            </div>
                            
                            {portfolio.skills && (
                                <div className="mb-4">
                                    <h6 className="text-uppercase text-white-50 fw-bold border-bottom border-secondary pb-2 d-inline-block">Specialized Skills</h6>
                                    <p className="mt-2">{portfolio.skills}</p>
                                </div>
                            )}

                            {portfolio.achievements && (
                                <div>
                                    <h6 className="text-uppercase text-white-50 fw-bold border-bottom border-secondary pb-2 d-inline-block">Key Achievements</h6>
                                    <p className="mt-2 text-start px-3" style={{ whiteSpace: 'pre-line' }}>{portfolio.achievements}</p>
                                </div>
                            )}
                            
                            {!portfolio.skills && !portfolio.achievements && (
                                <div className="text-white-50 mt-4">
                                    <p>Your portfolio is currently empty. Add your skills and achievements to see them previewed here.</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </StudentLayout>
    );
};

export default Portfolio;
