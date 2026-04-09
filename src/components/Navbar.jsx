import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AppNavbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
            <Container fluid className="px-md-4">
                <Navbar.Brand as={Link} to={user?.role === 'ROLE_ADMIN' ? '/admin/dashboard' : (user ? '/student/dashboard' : '/') } className="fw-bold">
                    PortfolioTracker
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        {!user ? (
                            <>
                                <Nav.Link as={Link} to="/login" className="btn btn-outline-light me-2 px-3 mb-2 mb-lg-0">Login</Nav.Link>
                                <Nav.Link as={Link} to="/register" className="btn btn-primary px-3 text-white">Register</Nav.Link>
                            </>
                        ) : (
                            <>
                                <span className="text-light me-3 mb-2 mb-lg-0 d-none d-lg-block">Welcome, {user.username}</span>
                                <Button variant="outline-danger" size="sm" onClick={handleLogout}>Logout</Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;
