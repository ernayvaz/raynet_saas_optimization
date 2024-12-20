// src/pages/Dashboard.js

import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import './Dashboard.css';
import { fetchUsers, fetchLicenses, fetchUsageStats, fetchOptimizations } from '../services/api';

const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const [licenses, setLicenses] = useState([]);
    const [usageStats, setUsageStats] = useState([]);
    const [optimizations, setOptimizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, licensesRes, usageStatsRes, optimizationsRes] = await Promise.all([
                    fetchUsers(),
                    fetchLicenses(),
                    fetchUsageStats(),
                    fetchOptimizations()
                ]);

                setUsers(usersRes.data);
                setLicenses(licensesRes.data);
                setUsageStats(usageStatsRes.data);
                setOptimizations(optimizationsRes.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err.response ? err.response.data : err.message);
                setError('Veri çekme sırasında bir hata oluştu.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Kullanım istatistikleri grafiği için veriler
    const usageData = {
        labels: usageStats.map(stat => new Date(stat.date).toLocaleDateString()),
        datasets: [
            {
                label: 'Active Minutes',
                data: usageStats.map(stat => stat.active_minutes),
                backgroundColor: 'rgba(75,192,192,0.6)',
            },
        ],
    };

    // Lisans dağılımı grafiği için veriler
    const licenseData = {
        labels: licenses.map(license => license.license_name),
        datasets: [
            {
                label: 'Licenses',
                data: licenses.map(license => {
                    // Kullanıcıların sahip olduğu her lisans için birim sayısını hesaplayın
                    const count = usageStats.filter(stat => stat.license_id === license.license_id).length;
                    return count;
                }),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                ],
            },
        ],
    };

    // Yükleniyor durumunda gösterilecek bir spinner ekleyin
    if (loading) {
        return (
            <div style={styles.loading}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Yükleniyor...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return <div style={styles.error}>{error}</div>;
    }

    return (
        <div style={styles.container}>
            <h1>Dashboard</h1>
            
            <section style={styles.section}>
                <h2>Usage Statistics</h2>
                {usageStats.length > 0 ? <Bar data={usageData} /> : <p>Veri yok</p>}
            </section>
            
            <section style={styles.section}>
                <h2>Users</h2>
                {users.length > 0 ? (
                    <ul>
                        {users.map(user => (
                            <li key={user.user_id}>{user.email}</li>
                        ))}
                    </ul>
                ) : (
                    <p>Kullanıcı bulunamadı.</p>
                )}
            </section>
            
            <section style={styles.section}>
                <h2>Licenses</h2>
                {licenses.length > 0 ? (
                    <ul>
                        {licenses.map(license => (
                            <li key={license.license_id}>{license.license_name}</li>
                        ))}
                    </ul>
                ) : (
                    <p>Lisans bulunamadı.</p>
                )}
            </section>

            <section style={styles.section}>
                <h2>License Distribution</h2>
                {licenses.length > 0 ? <Pie data={licenseData} /> : <p>Lisans dağılımı için veri yok.</p>}
            </section>
            
            <section style={styles.section}>
                <h2>Optimizations</h2>
                {optimizations.length > 0 ? (
                    <ul>
                        {optimizations.map(opt => (
                            <li key={opt.user_id + opt.license_id}>{opt.recommendation_text}</li>
                        ))}
                    </ul>
                ) : (
                    <p>Optimizasyon önerisi yok.</p>
                )}
            </section>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
    },
    section: {
        marginBottom: '40px',
    },
    loading: {
        textAlign: 'center',
        marginTop: '50px',
        fontSize: '24px',
    },
    error: {
        textAlign: 'center',
        marginTop: '50px',
        fontSize: '24px',
        color: 'red',
    },
};

export default Dashboard;
