import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Nav, Offcanvas, Navbar, Container } from 'react-bootstrap';

const Sidebar = ({ links, activeTab, title }) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const SidebarContent = () => (
        <>
            <h5 className="text-white text-center mb-4 pb-3 border-bottom border-secondary px-3 mt-3">{title}</h5>
            <Nav className="flex-column w-100">
                {links.map(link => (
                    <Nav.Link 
                        key={link.id}
                        as={Link} 
                        to={link.path}
                        className={`text-light py-3 px-4 mb-1 side-link ${activeTab === link.id ? 'bg-secondary border-start border-4 border-primary fw-bold' : ''}`}
                        onClick={handleClose}
                    >
                        {link.label}
                    </Nav.Link>
                ))}
            </Nav>
            <style>{`.side-link:hover { background-color: #343a40; }`}</style>
        </>
    );

    return (
        <>
            {/* Mobile Toggle Navbar (Appears only on small screens) */}
            <Navbar bg="dark" variant="dark" expand="md" className="d-md-none border-top border-secondary">
                <Container fluid>
                    <Navbar.Brand className="fs-6 text-muted">Navigation Menu</Navbar.Brand>
                    <Navbar.Toggle aria-controls="offcanvasSidebar" onClick={handleShow} className="border-0" />
                    <Navbar.Offcanvas
                        id="offcanvasSidebar"
                        aria-labelledby="offcanvasSidebarLabel"
                        placement="start"
                        show={show}
                        onHide={handleClose}
                        className="bg-dark"
                        style={{ width: '280px' }}
                    >
                        <Offcanvas.Header closeButton closeVariant="white">
                            <Offcanvas.Title id="offcanvasSidebarLabel" className="text-white">Menu</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body className="d-flex flex-column p-0">
                            <SidebarContent />
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>

            {/* Desktop Persistent Sidebar */}
            <nav className="col-md-3 col-lg-2 d-none d-md-flex flex-column bg-dark px-0 text-white" style={{ minHeight: 'calc(100vh - 56px)', position: 'sticky', top: '56px' }}>
                <SidebarContent />
            </nav>
        </>
    );
};

export default Sidebar;
