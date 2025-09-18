
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('admin@test.com');
    const [error, setError] = useState('');
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email) {
            setError('Email is required.');
            return;
        }
        try {
            await login(email);
            navigate('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <div className="w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-primary-600 dark:text-primary-400 mb-6">Mini CRM</h1>
                <Card>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-200">Login</h2>
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        <Input
                            id="email"
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g., admin@test.com"
                            required
                        />
                        <div>
                            <Button type="submit" className="w-full" isLoading={isLoading}>
                                Login
                            </Button>
                        </div>
                        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                            No account?{' '}
                            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                                Register here
                            </Link>
                        </p>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default LoginPage;
