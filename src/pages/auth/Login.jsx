import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const authResponse = await login({
                username: formData.username,
                password: formData.password,
            });

            if (authResponse.user.role === 'ROLE_ADMIN') {
                navigate('/admin/dashboard');
            } else {
                navigate('/student/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid credentials');
            console.error('Login failed', err);
        }
    };

    return (
        <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', paddingTop: '50px' }}>
            <Container>
                <Row className="justify-content-center">
                    <Col md={5}>
                        <Card className="shadow border-0 rounded-4">
                            <Card.Body className="p-5">
                                <h3 className="text-center mb-4 fw-bold text-primary">Login</h3>
                                
                                {error && <Alert variant="danger" className="py-2">{error}</Alert>}
                                
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-muted">Username</Form.Label>
                                        <Form.Control type="text" name="username" value={formData.username} onChange={handleChange} required />
                                    </Form.Group>
                                    
                                    <Form.Group className="mb-4">
                                        <Form.Label className="text-muted">Password</Form.Label>
                                        <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
                                    </Form.Group>
                                    
                                    <Button variant="primary" type="submit" className="w-100 py-2 rounded-pill">Sign In</Button>
                                </Form>
                                
                                <div className="text-center mt-4">
                                    <Link to="/forgot-password" className="text-decoration-none small text-muted">Forgot Password?</Link><br/>
                                    <Link to="/register" className="text-decoration-none small fw-bold mt-2 d-inline-block">Create an account</Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;
