// src/pages/Dashboard.js

import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, 
  PieChart, Pie, 
  XAxis, YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  Cell,
  ResponsiveContainer
} from 'recharts';
import styled from 'styled-components';
import { fetchUsers, fetchLicenses, fetchUsageStats, fetchOptimizations } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

// Styled Components
const DashboardContainer = styled.div`
  padding: 2rem;
  background: #f8f9fa;
`;

const Header = styled.h1`
  color: #2c3e50;
  margin-bottom: 2rem;
  font-weight: 600;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const StatTitle = styled.div`
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 600;
`;

const ChartContainer = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  margin-bottom: 2rem;
`;

const ChartHeader = styled.h2`
  color: #2c3e50;
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
`;

const RecommendationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
`;

const RecommendationCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  border-left: 4px solid #0088FE;
`;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
                setError('Veri yüklenirken bir hata oluştu.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="error-message">{error}</div>;

    const usageData = data.usageStats.map(stat => ({
        name: new Date(stat.date).toLocaleDateString(),
        value: stat.active_minutes
    }));

    const licenseData = data.licenses.map(license => ({
        name: license.license_name,
        value: data.usageStats.filter(stat => stat.license_id === license.license_id).length
    }));

    return (
        <DashboardContainer>
            <Header>Raynet One Dashboard</Header>
            
            <StatsGrid>
                <StatCard>
                    <StatTitle>Toplam Kullanıcı</StatTitle>
                    <StatValue>{data.users.length}</StatValue>
                </StatCard>
                <StatCard>
                    <StatTitle>Aktif Lisanslar</StatTitle>
                    <StatValue>{data.licenses.length}</StatValue>
                </StatCard>
                <StatCard>
                    <StatTitle>Optimizasyon Önerileri</StatTitle>
                    <StatValue>{data.optimizations.length}</StatValue>
                </StatCard>
            </StatsGrid>

            <ChartContainer>
                <ChartHeader>Kullanım Analizi</ChartHeader>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={usageData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#0088FE" name="Aktif Kullanım (Dakika)" />
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>

            <ChartContainer>
                <ChartHeader>Lisans Dağılımı</ChartHeader>
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie
                            data={licenseData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={150}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {licenseData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </ChartContainer>

            <ChartContainer>
                <ChartHeader>Optimizasyon Önerileri</ChartHeader>
                <RecommendationsGrid>
                    {data.optimizations.map((opt, index) => (
                        <RecommendationCard key={index}>
                            {opt.recommendation_text}
                        </RecommendationCard>
                    ))}
                </RecommendationsGrid>
            </ChartContainer>
        </DashboardContainer>
    );
};

export default Dashboard;
