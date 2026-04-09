import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { token, user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status" />
                    <p className="mt-3 text-muted mb-0">Restoring session...</p>
                </div>
            </div>
        );
    }

    if (!token) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        const fallbackPath = user?.role === 'ROLE_ADMIN'
            ? '/admin/dashboard'
            : user?.role === 'ROLE_STUDENT'
                ? '/student/dashboard'
                : '/login';

        return <Navigate to={fallbackPath} replace />;
    }

    return children;
};

export default ProtectedRoute;