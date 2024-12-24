// src/pages/Dashboard.js

import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar,
  PieChart, Pie,
  LineChart, Line,
  XAxis, YAxis, 
  CartesianGrid, 
  Tooltip,
  Cell,
  ResponsiveContainer 
} from 'recharts';
import styled from 'styled-components';
import { fetchUsers, fetchLicenses, fetchUsageStats, fetchOptimizations } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

// Styled Components
const DashboardContainer = styled.div`
  padding: 2rem;
  background: #ffffff;
  min-height: 100vh;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eaedf3;
`;

const HeaderTitle = styled.h1`
  color: #1a1f36;
  font-size: 1.75rem;
  font-weight: 500;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(16, 24, 40, 0.1);
  border: 1px solid #eaedf3;
`;

const ChartTitle = styled.h2`
  color: #1a1f36;
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(16, 24, 40, 0.1);
  border: 1px solid #eaedf3;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(16, 24, 40, 0.12);
    transform: translateY(-2px);
  }
`;

const StatTitle = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
`;

const StatValue = styled.div`
  color: #111827;
  font-size: 2rem;
  font-weight: 600;
  line-height: 1.2;
`;

const OptimizationContainer = styled.div`
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(16, 24, 40, 0.1);
  border: 1px solid #eaedf3;
  margin-top: 2rem;
`;

const OptimizationHeader = styled.h2`
  color: #1a1f36;
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #eaedf3;
`;

const OptimizationCard = styled.div`
  background: #f9fafb;
  padding: 1.25rem;
  border-radius: 8px;
  border-left: 4px solid #0052CC;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.5;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #dc2626;
  background: #fef2f2;
  border-radius: 8px;
  margin: 2rem auto;
  max-width: 600px;
`;

const COLORS = ['#0052CC', '#00B8D9', '#36B37E', '#FF5630', '#6554C0'];

const Dashboard = () => {
    const [data, setData] = useState({
        users: [],
        licenses: [],
        usageStats: [],
        optimizations: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [users, licenses, usageStats, optimizations] = await Promise.all([
                    fetchUsers(),
                    fetchLicenses(),
                    fetchUsageStats(),
                    fetchOptimizations()
                ]);

                setData({
                    users: users.data,
                    licenses: licenses.data,
                    usageStats: usageStats.data,
                    optimizations: optimizations.data
                });
                setLoading(false);
            } catch (err) {
                setError('An error occurred while loading data.');
                setLoading(false);
                console.error('Dashboard data fetch error:', err);
            }
        };

        fetchData();
    }, []);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage>{error}</ErrorMessage>;

    // Calculate license utilization rate
    const licenseUtilization = Math.round((data.users.length / data.licenses.length) * 100) || 0;

    // User distribution by department
    const departmentData = data.users.reduce((acc, user) => {
        acc[user.department] = (acc[user.department] || 0) + 1;
        return acc;
    }, {});

    const departmentChartData = Object.entries(departmentData).map(([name, value]) => ({
        name,
        value
    }));

    // User status distribution
    const statusData = [
        { name: 'Active', value: data.users.filter(u => u.status === 'active').length },
        { name: 'Inactive', value: data.users.filter(u => u.status === 'inactive').length }
    ];

    // Last 7 days usage trend
    const usageData = data.usageStats
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(-7)
        .map(stat => ({
            date: new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            minutes: stat.active_minutes
        }));

    return (
        <DashboardContainer>
            <Header>
                <HeaderTitle>License Optimization</HeaderTitle>
            </Header>
            
            <StatsGrid>
                <StatCard>
                    <StatTitle>Active Users</StatTitle>
                    <StatValue>{statusData[0].value}</StatValue>
                </StatCard>
                <StatCard>
                    <StatTitle>Total Licenses</StatTitle>
                    <StatValue>{data.licenses.length}</StatValue>
                </StatCard>
                <StatCard>
                    <StatTitle>License Utilization Rate</StatTitle>
                    <StatValue>{licenseUtilization}%</StatValue>
                </StatCard>
            </StatsGrid>

            <GridContainer>
                {/* User Status Distribution */}
                <ChartCard>
                    <ChartTitle>User Status Distribution</ChartTitle>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip 
                                formatter={(value, name) => [`${value} Users`, name]}
                                contentStyle={{
                                    background: '#fff',
                                    border: '1px solid #eaedf3',
                                    borderRadius: '4px'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Department Distribution */}
                <ChartCard>
                    <ChartTitle>Department Distribution</ChartTitle>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={departmentChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eaedf3" />
                            <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
                            <YAxis tick={{ fill: '#6b7280' }} />
                            <Tooltip
                                contentStyle={{
                                    background: '#fff',
                                    border: '1px solid #eaedf3',
                                    borderRadius: '4px'
                                }}
                            />
                            <Bar dataKey="value" fill="#0052CC" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Usage Trend */}
                <ChartCard>
                    <ChartTitle>Daily Usage Trend</ChartTitle>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={usageData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eaedf3" />
                            <XAxis dataKey="date" tick={{ fill: '#6b7280' }} />
                            <YAxis tick={{ fill: '#6b7280' }} />
                            <Tooltip
                                contentStyle={{
                                    background: '#fff',
                                    border: '1px solid #eaedf3',
                                    borderRadius: '4px'
                                }}
                                formatter={(value) => [`${value} minutes`]}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="minutes" 
                                stroke="#0052CC" 
                                strokeWidth={2}
                                dot={{ fill: '#0052CC', strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>
            </GridContainer>

            {data.optimizations.length > 0 && (
                <OptimizationContainer>
                    <OptimizationHeader>Optimization Recommendations</OptimizationHeader>
                    {data.optimizations.map((opt, index) => (
                        <OptimizationCard key={index}>
                            {opt.recommendation_text}
                        </OptimizationCard>
                    ))}
                </OptimizationContainer>
            )}
        </DashboardContainer>
    );
};

export default Dashboard;
