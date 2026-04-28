import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const createCaptcha = () => {
    const charsPool = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const picked = [];

    while (picked.length < 6) {
        const next = charsPool.charAt(Math.floor(Math.random() * charsPool.length));
        if (!picked.includes(next)) {
            picked.push(next);
        }
    }

    const decorated = picked.map((char) => ({
        char,
        rotate: Math.floor(Math.random() * 31) - 15,
        offsetY: Math.floor(Math.random() * 11) - 5,
    }));

    const value = picked.join('');
    return {
        answer: value,
        chars: decorated,
    };
};

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [captcha, setCaptcha] = useState(() => createCaptcha());
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRefreshCaptcha = () => {
        setCaptcha(createCaptcha());
        setCaptchaInput('');
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (captchaInput.trim().toUpperCase() !== captcha.answer) {
            setError('Captcha is incorrect. Please try again.');
            setCaptcha(createCaptcha());
            setCaptchaInput('');
            return;
        }
        
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
            setCaptcha(createCaptcha());
            setCaptchaInput('');
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
                                        <Form.Label className="text-muted">Username or Email</Form.Label>
                                        <Form.Control type="text" name="username" value={formData.username} onChange={handleChange} required />
                                    </Form.Group>
                                    
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-muted">Password</Form.Label>
                                        <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                            <Form.Label className="text-muted mb-0">Enter this captcha</Form.Label>
                                            <Button variant="outline-secondary" size="sm" type="button" onClick={handleRefreshCaptcha}>
                                                Refresh
                                            </Button>
                                        </div>
                                        <div
                                            className="rounded-3 border px-3 py-2 mb-2"
                                            style={{
                                                letterSpacing: '0.2rem',
                                                background: 'repeating-linear-gradient(135deg, #eef2ff, #eef2ff 8px, #e3f2fd 8px, #e3f2fd 16px)',
                                                userSelect: 'none',
                                            }}
                                        >
                                            {captcha.chars.map((item, index) => (
                                                <span
                                                    key={`${item.char}-${index}`}
                                                    style={{
                                                        display: 'inline-block',
                                                        fontWeight: 700,
                                                        fontSize: '1.15rem',
                                                        marginRight: '0.2rem',
                                                        transform: `translateY(${item.offsetY}px) rotate(${item.rotate}deg)`,
                                                    }}
                                                >
                                                    {item.char}
                                                </span>
                                            ))}
                                        </div>
                                        <Form.Control
                                            type="text"
                                            name="captcha"
                                            value={captchaInput}
                                            onChange={(e) => setCaptchaInput(e.target.value)}
                                            placeholder="Type the code shown above"
                                            maxLength={6}
                                            required
                                        />
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
