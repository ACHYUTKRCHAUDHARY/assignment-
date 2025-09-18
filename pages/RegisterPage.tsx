
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const RegisterPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!name || !email) {
            setError('All fields are required.');
            return;
        }
        setIsLoading(true);
        try {
            await register(name, email);
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <div className="w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-primary-600 dark:text-primary-400 mb-6">Mini CRM</h1>
                <Card>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-200">Register</h2>
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        {success && <p className="text-green-500 text-sm text-center">{success}</p>}
                        <Input
                            id="name"
                            label="Name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <Input
                            id="email"
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <div>
                            <Button type="submit" className="w-full" isLoading={isLoading}>
                                Register
                            </Button>
                        </div>
                        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                                Login here
                            </Link>
                        </p>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default RegisterPage;
