import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import api from '../../services/api';

const ForgotPassword = () => {
    const [emailData, setEmailData] = useState({ email: '' });
    const [resetData, setResetData] = useState({ token: '', newPassword: '' });
    const [emailSent, setEmailSent] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleEmailChange = (e) => {
        setEmailData({ ...emailData, [e.target.name]: e.target.value });
    };

    const handleResetChange = (e) => {
        setResetData({ ...resetData, [e.target.name]: e.target.value });
    };

    const handleSendEmail = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const res = await api.post('/auth/forgot-password', emailData);
            setMessage(res.data.message);
            setEmailSent(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send reset email');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const res = await api.post('/auth/reset-password', resetData);
            setMessage(res.data.message);
            setResetData({ token: '', newPassword: '' });
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
                                
                                <p className="text-muted small text-center mb-4">Step 1: Enter your registered email to receive a reset token.</p>

                                <Form onSubmit={handleSendEmail}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email Address</Form.Label>
                                        <Form.Control type="email" name="email" value={emailData.email} onChange={handleEmailChange} required placeholder="student@example.com" />
                                    </Form.Group>

                                    <Button variant="warning" type="submit" className="w-100 py-2 rounded-pill text-dark fw-bold mb-4">Send Reset Email</Button>
                                </Form>

                                {emailSent && (
                                    <>
                                        <p className="text-muted small text-center mb-3">Step 2: Enter the token from email and set your new password.</p>
                                        <Form onSubmit={handleResetPassword}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Reset Token</Form.Label>
                                                <Form.Control type="text" name="token" value={resetData.token} onChange={handleResetChange} required />
                                            </Form.Group>

                                            <Form.Group className="mb-4">
                                                <Form.Label>New Password</Form.Label>
                                                <Form.Control type="password" name="newPassword" value={resetData.newPassword} onChange={handleResetChange} required />
                                            </Form.Group>

                                            <Button variant="primary" type="submit" className="w-100 py-2 rounded-pill fw-bold">Reset Password</Button>
                                        </Form>
                                    </>
                                )}
                                
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
