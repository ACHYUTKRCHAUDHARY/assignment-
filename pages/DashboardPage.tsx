
import React, { useEffect, useMemo } from 'react';
import { useData } from '../hooks/useData';
import { Lead, LeadStatus } from '../types';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';

const COLORS: { [key in LeadStatus]: string } = {
    [LeadStatus.New]: '#3b82f6',
    [LeadStatus.Contacted]: '#f97316',
    [LeadStatus.Converted]: '#22c55e',
    [LeadStatus.Lost]: '#ef4444',
};

const DashboardPage: React.FC = () => {
    const { allLeads, loading, fetchAllLeads } = useData();

    useEffect(() => {
        fetchAllLeads();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const leadsByStatus = useMemo(() => {
        return allLeads.reduce((acc, lead) => {
            acc[lead.status] = (acc[lead.status] || 0) + 1;
            return acc;
        }, {} as Record<LeadStatus, number>);
    }, [allLeads]);

    const pieChartData = Object.entries(leadsByStatus).map(([name, value]) => ({ name, value }));

    const valueByStatus = useMemo(() => {
        return allLeads.reduce((acc, lead) => {
            acc[lead.status] = (acc[lead.status] || 0) + lead.value;
            return acc;
        }, {} as Record<LeadStatus, number>);
    }, [allLeads]);

    const barChartData = Object.entries(valueByStatus).map(([name, value]) => ({ name, value }));
    
    const totalLeads = allLeads.length;
    const totalValue = allLeads.reduce((sum, lead) => sum + lead.value, 0);
    const conversionRate = totalLeads > 0 ? ((leadsByStatus[LeadStatus.Converted] || 0) / totalLeads * 100).toFixed(1) : 0;


    if (loading && allLeads.length === 0) {
        return <div className="flex justify-center items-center h-full"><Spinner size="lg" /></div>;
    }

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card><div className="text-center"><p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Leads</p><p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{totalLeads}</p></div></Card>
                <Card><div className="text-center"><p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Value</p><p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">${totalValue.toLocaleString()}</p></div></Card>
                <Card><div className="text-center"><p className="text-sm font-medium text-gray-500 dark:text-gray-400">Conversion Rate</p><p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{conversionRate}%</p></div></Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Leads by Status">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {pieChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as LeadStatus]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
                <Card title="Total Value by Status">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                            <Legend />
                            <Bar dataKey="value">
                                {barChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as LeadStatus]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    );
};

export default DashboardPage;
