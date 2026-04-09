import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import api from '../../services/api';

const ForgotPassword = () => {
    const [formData, setFormData] = useState({ email: '', newPassword: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const res = await api.post('/auth/forgot-password', formData);
            setMessage(res.data.message);
            setFormData({ email: '', newPassword: '' });
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to reset password');
        }
    };

    return (
        <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', paddingTop: '50px' }}>
            <Container>
                <Row className="justify-content-center">
                    <Col md={5}>
                        <Card className="shadow border-0 rounded-4">
                            <Card.Body className="p-5">
                                <h4 className="text-center mb-4 fw-bold text-dark">Reset Password</h4>
                                
                                {error && <Alert variant="danger" className="py-2">{error}</Alert>}
                                {message && <Alert variant="success" className="py-2">{message}</Alert>}
                                
                                <p className="text-muted small text-center mb-4">Enter your registered email address to reset your password.</p>
                                
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email Address</Form.Label>
                                        <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="student@example.com" />
                                    </Form.Group>
                                    
                                    <Form.Group className="mb-4">
                                        <Form.Label>New Password</Form.Label>
                                        <Form.Control type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} required />
                                    </Form.Group>
                                    
                                    <Button variant="warning" type="submit" className="w-100 py-2 rounded-pill text-dark fw-bold">Update Password</Button>
                                </Form>
                                
                                <div className="text-center mt-4">
                                    <Link to="/login" className="text-decoration-none small text-muted">Back to Login</Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ForgotPassword;
