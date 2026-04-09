import React from 'react';
import { ProgressBar } from 'react-bootstrap';

const MilestoneTracker = ({ milestones }) => {
    if (!milestones || milestones.length === 0) {
        return (
            <div className="text-center text-muted py-5 mt-4 border rounded bg-light">
                <h6>No milestones added yet.</h6>
                <p className="mb-0">Use the form to add your first milestone and track your project progress.</p>
            </div>
        );
    }

    return (
        <div className="milestone-container mt-4">
            {milestones.map(m => (
                <div key={m.id} className="mb-4 bg-white p-3 rounded shadow-sm border">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="fw-bold mb-0 text-dark">{m.milestoneName}</h6>
                        <span className="badge bg-light text-dark border">Due: {m.deadline}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <small className="text-primary fw-bold">{m.progress}% Complete</small>
                    </div>
                    <ProgressBar 
                        now={m.progress} 
                        striped={m.progress < 100} 
                        animated={m.progress > 0 && m.progress < 100}
                        variant={m.progress === 100 ? "success" : "primary"} 
                        className="mb-1" 
                        style={{ height: '12px' }} 
                    />
                </div>
            ))}
        </div>
    );
};

export default MilestoneTracker;
