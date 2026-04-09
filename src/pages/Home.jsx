import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Row, Col, Card } from 'react-bootstrap';

const Home = () => {
  return (
    <>
      <div className="text-center text-white py-5" style={{ background: 'linear-gradient(135deg, #0d6efd, #0dcaf0)' }}>
        <Container className="py-5">
          <h1 className="display-4 fw-bold">Student Project & Portfolio Manager</h1>
          <p className="lead mt-3">Organize your academic projects, measure milestones, and build a standout digital portfolio.</p>
          <Button as={Link} to="/register" variant="light" size="lg" className="mt-4 shadow-sm px-4 rounded-pill text-primary fw-bold">
            Get Started Today
          </Button>
        </Container>
      </div>

      <Container className="mt-5 py-5 text-center">
        <Row className="g-4">
          <Col md={4}>
            <Card className="h-100 shadow-sm border-0 rounded-4 feature-card">
              <Card.Body className="py-5">
                <Card.Title className="text-primary fw-bold fs-4">Track Projects</Card.Title>
                <Card.Text className="text-muted mt-3">Keep all your academic projects neatly structured, from pending ideas to approved final submissions.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 shadow-sm border-0 rounded-4 feature-card">
              <Card.Body className="py-5">
                <Card.Title className="text-primary fw-bold fs-4">Set Milestones</Card.Title>
                <Card.Text className="text-muted mt-3">Update project progress interactively by setting deadlines and completing milestones over time.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 shadow-sm border-0 rounded-4 feature-card">
              <Card.Body className="py-5">
                <Card.Title className="text-primary fw-bold fs-4">Build Portfolio</Card.Title>
                <Card.Text className="text-muted mt-3">Showcase your acquired skills and notable achievements to future employers in one centralized hub.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
