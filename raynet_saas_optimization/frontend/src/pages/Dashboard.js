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

const OptimizationSectionHeader = styled.h2`
    color: #1a1f36;
    font-size: 1.125rem;
    font-weight: 500;
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #eaedf3;
`;

const OptimizationCardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.5rem;
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

const UserTable = styled.div`
    margin-top: 2rem;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(16, 24, 40, 0.1);
    border: 1px solid #eaedf3;
    overflow: hidden;
`;

const TableHeader = styled.div`
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #eaedf3;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const TableTitle = styled.h2`
    color: #1a1f36;
    font-size: 1.125rem;
    font-weight: 500;
    margin: 0;
`;

const Table = styled.div`
    width: 100%;
    overflow-x: auto;
`;

const TableContent = styled.table`
    width: 100%;
    border-collapse: collapse;
    min-width: 800px;
`;

const Th = styled.th`
    text-align: left;
    padding: 1rem 1.5rem;
    color: #6b7280;
    font-weight: 500;
    font-size: 0.875rem;
    border-bottom: 1px solid #eaedf3;
    background: #f9fafb;
`;

const Td = styled.td`
    padding: 1rem 1.5rem;
    color: #374151;
    font-size: 0.875rem;
    border-bottom: 1px solid #eaedf3;
`;

const StatusBadge = styled.span`
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    background: ${props => props.active ? '#dcfce7' : '#fee2e2'};
    color: ${props => props.active ? '#166534' : '#991b1b'};
`;

const OptimizationUser = styled.div`
    font-weight: 500;
    color: #1a1f36;
`;

const OptimizationMeta = styled.div`
    font-size: 0.75rem;
    color: #6b7280;
`;

const COLORS = ['#0052CC', '#00B8D9', '#36B37E', '#FF5630', '#6554C0'];

const TableControls = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;
`;

const SearchInput = styled.input`
    padding: 0.5rem 1rem;
    border: 1px solid #eaedf3;
    border-radius: 6px;
    font-size: 0.875rem;
    width: 250px;
    &:focus {
        outline: none;
        border-color: #0052CC;
        box-shadow: 0 0 0 2px rgba(0, 82, 204, 0.1);
    }
`;

const FilterSelect = styled.select`
    padding: 0.5rem 1rem;
    border: 1px solid #eaedf3;
    border-radius: 6px;
    font-size: 0.875rem;
    background-color: white;
    &:focus {
        outline: none;
        border-color: #0052CC;
    }
`;

const Pagination = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-top: 1px solid #eaedf3;
`;

const PageInfo = styled.div`
    color: #6b7280;
    font-size: 0.875rem;
`;

const PageControls = styled.div`
    display: flex;
    gap: 0.5rem;
`;

const PageButton = styled.button`
    padding: 0.5rem 1rem;
    border: 1px solid #eaedf3;
    border-radius: 6px;
    background: ${props => props.active ? '#0052CC' : 'white'};
    color: ${props => props.active ? 'white' : '#374151'};
    font-size: 0.875rem;
    cursor: pointer;
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    &:hover:not(:disabled) {
        background: ${props => props.active ? '#0052CC' : '#f9fafb'};
    }
`;

const ItemsPerPageSelect = styled.select`
    padding: 0.5rem;
    border: 1px solid #eaedf3;
    border-radius: 6px;
    font-size: 0.875rem;
    margin-left: 1rem;
`;

const Dashboard = () => {
    const [data, setData] = useState({
        users: [],
        licenses: [],
        usageStats: [],
        optimizations: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

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

    // Get unique departments for filter
    const departments = ['all', ...new Set(data.users.map(user => user.department))];

    // Filter users based on search and filters
    const filteredUsers = data.users.filter(user => {
        const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.department.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDepartment = departmentFilter === 'all' || user.department === departmentFilter;
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        
        return matchesSearch && matchesDepartment && matchesStatus;
    });

    // Calculate pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Generate page numbers
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, departmentFilter, statusFilter]);

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

            <UserTable>
                <TableHeader>
                    <TableTitle>User Overview</TableTitle>
                    <TableControls>
                        <SearchInput
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <FilterSelect
                            value={departmentFilter}
                            onChange={(e) => setDepartmentFilter(e.target.value)}
                        >
                            <option value="all">All Departments</option>
                            {departments.filter(dept => dept !== 'all').map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </FilterSelect>
                        <FilterSelect
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </FilterSelect>
                    </TableControls>
                </TableHeader>
                <Table>
                    <TableContent>
                        <thead>
                            <tr>
                                <Th>User</Th>
                                <Th>Department</Th>
                                <Th>Status</Th>
                                <Th>License Type</Th>
                                <Th>Last Active</Th>
                                <Th>Usage Time</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((user, index) => {
                                const userStats = data.usageStats.find(stat => stat.user_id === user.user_id);
                                const userLicense = data.licenses.find(license => 
                                    data.usageStats.some(stat => 
                                        stat.user_id === user.user_id && stat.license_id === license.license_id
                                    )
                                );
                                
                                return (
                                    <tr key={user.user_id}>
                                        <Td>{user.email}</Td>
                                        <Td>{user.department}</Td>
                                        <Td>
                                            <StatusBadge active={user.status === 'active'}>
                                                {user.status === 'active' ? 'Active' : 'Inactive'}
                                            </StatusBadge>
                                        </Td>
                                        <Td>{userLicense?.license_name || 'N/A'}</Td>
                                        <Td>{userStats?.last_active_at ? new Date(userStats.last_active_at).toLocaleDateString() : 'N/A'}</Td>
                                        <Td>{userStats?.active_minutes ? `${Math.round(userStats.active_minutes / 60)} hours` : 'N/A'}</Td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </TableContent>
                </Table>
                <Pagination>
                    <PageInfo>
                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} users
                        <ItemsPerPageSelect
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                        >
                            <option value={5}>5 per page</option>
                            <option value={10}>10 per page</option>
                            <option value={20}>20 per page</option>
                            <option value={50}>50 per page</option>
                        </ItemsPerPageSelect>
                    </PageInfo>
                    <PageControls>
                        <PageButton
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </PageButton>
                        {pageNumbers.map(number => (
                            <PageButton
                                key={number}
                                onClick={() => paginate(number)}
                                active={currentPage === number}
                            >
                                {number}
                            </PageButton>
                        ))}
                        <PageButton
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </PageButton>
                    </PageControls>
                </Pagination>
            </UserTable>

            {data.optimizations.length > 0 && (
                <OptimizationContainer>
                    <OptimizationSectionHeader>Optimization Recommendations</OptimizationSectionHeader>
                    {data.optimizations.map((opt, index) => {
                        const user = data.users.find(u => u.user_id === opt.user_id);
                        const license = data.licenses.find(l => l.license_id === opt.license_id);
                        
                        return (
                            <OptimizationCard key={index}>
                                <OptimizationCardHeader>
                                    <OptimizationUser>
                                        {user?.email || 'Unknown User'} - {license?.license_name || 'Unknown License'}
                                    </OptimizationUser>
                                    <OptimizationMeta>
                                        Department: {user?.department || 'N/A'}
                                    </OptimizationMeta>
                                </OptimizationCardHeader>
                                {opt.recommendation_text}
                            </OptimizationCard>
                        );
                    })}
                </OptimizationContainer>
            )}
        </DashboardContainer>
    );
};

export default Dashboard;
