import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
    return (
        <footer className="bg-dark text-white-50 py-4 mt-auto">
            <Container className="text-center">
                <p className="mb-0 small">
                    &copy; {new Date().getFullYear()} Student Project & Portfolio Tracking System. All rights reserved.
                </p>
                <p className="mb-0 small mt-1">Built with React, Vite & Spring Boot.</p>
            </Container>
        </footer>
    );
};

export default Footer;
