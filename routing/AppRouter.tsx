
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import CustomersPage from '../pages/CustomersPage';
import CustomerDetailPage from '../pages/CustomerDetailPage';
import ProtectedRoute from './ProtectedRoute';
import Layout from '../components/layout/Layout';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/ui/Spinner';

const AppRouter: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <Routes>
            <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" />} />
            <Route
                path="/*"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Routes>
                                <Route path="/" element={<DashboardPage />} />
                                <Route path="/customers" element={<CustomersPage />} />
                                <Route path="/customers/:id" element={<CustomerDetailPage />} />
                                <Route path="*" element={<Navigate to="/" />} />
                            </Routes>
                        </Layout>
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};

export default AppRouter;
