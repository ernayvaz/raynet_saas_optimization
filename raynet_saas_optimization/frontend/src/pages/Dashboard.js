// src/pages/Dashboard.js

import React, { useEffect, useState, useMemo } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import './Dashboard.css';
import { fetchUsers, fetchLicenses, fetchUsageStats, fetchOptimizations } from '../services/api';

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
            } catch (err) {
                setError('Veri yüklenirken bir hata oluştu.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const chartData = useMemo(() => ({
        usage: {
            labels: data.usageStats.map(stat => new Date(stat.date).toLocaleDateString()),
            datasets: [
                {
                    label: 'Aktif Kullanım (Dakika)',
                    data: data.usageStats.map(stat => stat.active_minutes),
                    backgroundColor: 'rgba(52, 152, 219, 0.6)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                }
            ]
        },
        license: {
            labels: data.licenses.map(license => license.license_name),
            datasets: [{
                data: data.licenses.map(license => 
                    data.usageStats.filter(stat => stat.license_id === license.license_id).length
                ),
                backgroundColor: [
                    'rgba(52, 152, 219, 0.6)',
                    'rgba(46, 204, 113, 0.6)',
                    'rgba(155, 89, 182, 0.6)',
                ]
            }]
        }
    }), [data]);

    if (loading) return <div className="loading-container">Yükleniyor...</div>;
    if (error) return <div className="error-container">{error}</div>;

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-header">Raynet SaaS Optimizasyon Paneli</h1>
            
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-title">Toplam Kullanıcı</div>
                    <div className="stat-value">{data.users.length}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-title">Aktif Lisanslar</div>
                    <div className="stat-value">{data.licenses.length}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-title">Optimizasyon Önerileri</div>
                    <div className="stat-value">{data.optimizations.length}</div>
                </div>
            </div>

            <div className="chart-container">
                <h2 className="chart-header">Kullanım Analizi</h2>
                <Bar data={chartData.usage} options={chartOptions.bar} />
            </div>

            <div className="chart-container">
                <h2 className="chart-header">Lisans Dağılımı</h2>
                <Pie data={chartData.license} options={chartOptions.pie} />
            </div>

            <div className="chart-container">
                <h2 className="chart-header">Optimizasyon Önerileri</h2>
                <div className="recommendations-grid">
                    {data.optimizations.map((opt, index) => (
                        <div key={index} className="recommendation-card">
                            {opt.recommendation_text}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const chartOptions = {
    bar: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    },
    pie: {
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
            }
        }
    }
};

export default React.memo(Dashboard);
