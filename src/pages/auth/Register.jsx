import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import api from '../../services/api';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', formData);
            // Optionally could auto-login here, but we redirect to login like original feature
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', paddingTop: '50px' }}>
            <Container>
                <Row className="justify-content-center">
                    <Col md={5}>
                        <Card className="shadow border-0 rounded-4">
                            <Card.Body className="p-5">
                                <h3 className="text-center mb-4 fw-bold text-primary">Student Registration</h3>
                                
                                {error && <Alert variant="danger" className="py-2">{error}</Alert>}
                                
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-muted">Username</Form.Label>
                                        <Form.Control type="text" name="username" value={formData.username} onChange={handleChange} required />
                                    </Form.Group>
                                    
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-muted">Email Address</Form.Label>
                                        <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
                                    </Form.Group>
                                    
                                    <Form.Group className="mb-4">
                                        <Form.Label className="text-muted">Password</Form.Label>
                                        <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
                                    </Form.Group>
                                    
                                    <Button variant="primary" type="submit" className="w-100 py-2 rounded-pill">Register</Button>
                                </Form>
                                
                                <div className="text-center mt-4">
                                    <span className="text-muted small">Already have an account? </span>
                                    <Link to="/login" className="text-decoration-none small fw-bold">Sign In here</Link>
                                </div>
                            </Card.Body>
                        </Card>
                        
                        <div className="text-center mt-3">
                            <Link to="/" className="text-muted text-decoration-none small">&larr; Back to Home</Link>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Register;
