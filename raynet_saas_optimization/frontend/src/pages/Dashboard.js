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

// Styled Components
const DashboardContainer = styled.div`
  padding: 2.5rem 2.5rem 0 2.5rem;
  background: #2C4459;
  min-height: 100vh;
  width: 100%;
  max-width: 100vw;
  margin: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

const MainContent = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 5rem);
  margin-bottom: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2.5rem;
  padding: 2.5rem;
  background: linear-gradient(135deg, #1a2942 0%, #2C4459 100%);
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 1rem;
`;

const LogoImage = styled.img`
  width: 90px;
  height: 90px;
  object-fit: contain;
`;

const LogoCredit = styled.div`
  font-family: 'Dancing Script', cursive;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.5rem;
  margin-top: 0.5rem;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const DashboardText = styled.div`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const HeaderTitle = styled.h1`
  color: #ffffff;
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  letter-spacing: -0.5px;
  font-family: 'Inter', sans-serif;
`;

const HeaderSubtitle = styled.h2`
  color: rgba(255, 255, 255, 0.85);
  font-size: 1.1rem;
  font-weight: 400;
  margin: 0.75rem 0 0 0;
  letter-spacing: 0.2px;
  line-height: 1.4;
  font-family: 'Inter', sans-serif;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: 2.5rem;
  
  @media (max-width: 1400px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(234, 237, 243, 0.7);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  min-height: 450px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  }
`;

const ChartTitle = styled.h2`
  color: #1a2942;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 2rem;
  letter-spacing: -0.2px;
  font-family: 'Inter', sans-serif;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 2.5rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
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
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    background-color: ${props => props['data-active'] ? '#4CAF50' : '#FF5252'};
    color: white;
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

const OptimizationFilters = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const OptimizationSearchInput = styled(SearchInput)`
  flex: 1;
`;

// Update PieChart component
const PieChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 380px;
  padding: 1rem;
`;

const PieChartLegend = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 1rem;
  margin-top: 1rem;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: fit-content;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: #000000;
  font-weight: 500;
`;

const LegendColor = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 4px;
  background-color: ${props => props.color};
`;

const RADIAN = Math.PI / 180;

// eslint-disable-next-line no-unused-vars
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const LoadingSpinner = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-size: 1.5rem;
    color: #666;
`;

const Copyright = styled.div`
  text-align: center;
  padding: 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  font-weight: 400;
  letter-spacing: 0.02em;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(180deg, rgba(44, 68, 89, 0.8) 0%, rgba(26, 41, 66, 0.9) 100%);
  backdrop-filter: blur(8px);
  margin-top: auto;
`;

const formatUserData = (users) => {
    // Gelen veri kontrolü
    if (!Array.isArray(users)) {
        console.warn('Invalid users data received:', users);
        return [];
    }

    const departmentUsers = {
        'Engineering': [
            { name: 'Satya Nadella', email: 'satya.nadella' },
            { name: 'Scott Guthrie', email: 'scott.guthrie' },
            { name: 'Kevin Scott', email: 'kevin.scott' },
            { name: 'Julia Liuson', email: 'julia.liuson' },
            { name: 'Rajesh Jha', email: 'rajesh.jha' }
        ],
        'Sales': [
            { name: 'Judson Althoff', email: 'judson.althoff' },
            { name: 'Jean Philippe', email: 'jean.philippe' },
            { name: 'Chris Capossela', email: 'chris.capossela' },
            { name: 'Amy Hood', email: 'amy.hood' },
            { name: 'Toni Townes', email: 'toni.townes' }
        ],
        'Marketing': [
            { name: 'Kathleen Hogan', email: 'kathleen.hogan' },
            { name: 'Brad Smith', email: 'brad.smith' },
            { name: 'Panos Panay', email: 'panos.panay' },
            { name: 'Jason Zander', email: 'jason.zander' },
            { name: 'Kurt DelBene', email: 'kurt.delbene' }
        ],
        'Human Resources': [
            { name: 'Robin Seiler', email: 'robin.seiler' },
            { name: 'Lisa Tanzi', email: 'lisa.tanzi' },
            { name: "Dave O'Brien", email: 'dave.obrien' },
            { name: 'Sarah Bond', email: 'sarah.bond' },
            { name: 'Matt Booty', email: 'matt.booty' }
        ],
        'Finance': [
            { name: 'Phil Spencer', email: 'phil.spencer' },
            { name: 'Yusuf Mehdi', email: 'yusuf.mehdi' },
            { name: 'James Phillips', email: 'james.phillips' },
            { name: 'Takeshi Numoto', email: 'takeshi.numoto' },
            { name: 'David Zhang', email: 'david.zhang' }
        ],
        'Development': [
            { name: 'Ashley McNamara', email: 'ashley.mcnamara' },
            { name: 'Scott Hanselman', email: 'scott.hanselman' },
            { name: 'James Montemagno', email: 'james.montemagno' },
            { name: 'Maoni Stephens', email: 'maoni.stephens' },
            { name: 'Daniel Roth', email: 'daniel.roth' }
        ],
        'General': [
            { name: 'Frank Shaw', email: 'frank.shaw' },
            { name: 'Alice Rison', email: 'alice.rison' },
            { name: 'John Mueller', email: 'john.mueller' },
            { name: 'Peter Lee', email: 'peter.lee' },
            { name: 'Eric Boyd', email: 'eric.boyd' }
        ]
    };

    try {
        return users.map(user => {
            if (!user || typeof user !== 'object') {
                console.warn('Invalid user object:', user);
                return {
                    user_id: `default-${Math.random().toString(36).substr(2, 9)}`,
                    name: 'System User',
                    email: 'admin@microsoft.com',
                    department: 'General',
                    status: 'inactive'
                };
            }

            // Departman kontrolü ve normalizasyonu
            let dept = 'General';
            if (user.department) {
                const normalizedDept = Object.keys(departmentUsers).find(
                    d => d.toLowerCase() === user.department.toLowerCase()
                );
                if (normalizedDept) {
                    dept = normalizedDept;
                }
            }

            // User ID kontrolü
            const userId = user.user_id || `default-${Math.random().toString(36).substr(2, 9)}`;
            const userIndex = Math.abs(parseInt(userId.toString().replace(/[^\d]/g, '')) || 0) % departmentUsers[dept].length;
            const selectedUser = departmentUsers[dept][userIndex];

            return {
                ...user,
                user_id: userId,
                name: selectedUser.name,
                email: `${selectedUser.email}@microsoft.com`,
                department: dept,
                status: user.status || 'inactive'
            };
        });
    } catch (error) {
        console.error('Error in formatUserData:', error);
        return [];
    }
};

const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const [licenses, setLicenses] = useState([]);
    const [usageStats, setUsageStats] = useState([]);
    const [optimizations, setOptimizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [optimizationSearchTerm, setOptimizationSearchTerm] = useState('');
    const [licenseFilter, setLicenseFilter] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log('Fetching data...');

                const [usersRes, licensesRes, statsRes, optsRes] = await Promise.all([
                    fetchUsers(),
                    fetchLicenses(),
                    fetchUsageStats(),
                    fetchOptimizations()
                ]);

                // API yanıtlarını kontrol et
                if (!usersRes?.data) {
                    throw new Error('Invalid users data received from API');
                }

                // Kullanıcı verilerini formatla
                const formattedUsers = formatUserData(usersRes.data);
                if (formattedUsers.length === 0) {
                    throw new Error('No valid users data after formatting');
                }

                console.log('Users:', formattedUsers);
                console.log('Licenses:', licensesRes.data);
                console.log('Usage Stats:', statsRes.data);
                console.log('Optimizations:', optsRes.data);

                setUsers(formattedUsers);
                setLicenses(licensesRes?.data || []);
                setUsageStats(statsRes?.data || []);
                setOptimizations(optsRes?.data || []);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                const errorMessage = err.response?.data?.detail || err.message || 'An error occurred while loading data';
                setError(`${errorMessage}. Please check the console for details.`);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div style={{ padding: '2rem', color: 'red' }}>{error}</div>;
    }

    // User distribution by department
    const departmentData = users.reduce((acc, user) => {
        acc[user.department] = (acc[user.department] || 0) + 1;
        return acc;
    }, {});

    const departmentChartData = Object.entries(departmentData).map(([name, value]) => ({
        name,
        value
    }));

    // User status distribution
    const statusData = [
        { name: 'Active', value: users.filter(u => u.status === 'active').length },
        { name: 'Inactive', value: users.filter(u => u.status === 'inactive').length }
    ];

    // Last 7 days usage trend
    const usageData = usageStats
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(-7)
        .map(stat => ({
            date: new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            minutes: stat.active_minutes
        }));

    // Get unique departments for filter
    const departments = ['all', ...new Set(users.map(user => user.department))];

    // Filter users based on search and filters
    const filteredUsers = users.filter(user => {
        const searchTermLower = searchTerm.toLowerCase();
        const matchesSearch = (
            user.name.toLowerCase().includes(searchTermLower) ||
            user.email.toLowerCase().includes(searchTermLower) ||
            (user.department || '').toLowerCase().includes(searchTermLower)
        );
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

    // Add filtered optimizations logic before the return statement
    const filteredOptimizations = optimizations.filter(opt => {
        const user = users.find(u => u.user_id === opt.user_id);
        const license = licenses.find(l => l.license_id === opt.license_id);
        
        const matchesSearch = (
            (user?.name || '').toLowerCase().includes(optimizationSearchTerm.toLowerCase()) ||
            (user?.email || '').toLowerCase().includes(optimizationSearchTerm.toLowerCase()) ||
            opt.recommendation_text.toLowerCase().includes(optimizationSearchTerm.toLowerCase())
        );
        
        const matchesLicense = licenseFilter === 'all' || license?.license_name === licenseFilter;
        
        return matchesSearch && matchesLicense;
    });

    // Inside the Dashboard component, add a function to standardize license names
    const standardizeLicenseName = (licenseName) => {
        if (licenseName?.toLowerCase() === 'microsoft teams (free)') {
            return 'MICROSOFT TEAMS (FREE)';
        }
        return licenseName;
    };

    const getUniqueLicenses = (licenses) => {
        const uniqueLicenses = [];
        const seen = new Set();
        
        // Önce mevcut lisansları ekle
        licenses.forEach(license => {
            const name = standardizeLicenseName(license.license_name);
            if (!seen.has(name)) {
                seen.add(name);
                uniqueLicenses.push({
                    ...license,
                    license_name: name
                });
            }
        });

        // Varsayılan lisans tiplerini ekle (eğer henüz eklenmemişse)
        const defaultLicenses = [
            { license_name: 'MICROSOFT TEAMS PREMIUM', cost_per_user: 18 },
            { license_name: 'MICROSOFT TEAMS BUSINESS', cost_per_user: 12.50 },
            { license_name: 'MICROSOFT TEAMS STANDARD', cost_per_user: 10 },
            { license_name: 'MICROSOFT TEAMS BUSINESS BASIC', cost_per_user: 6 },
            { license_name: 'MICROSOFT TEAMS (FREE)', cost_per_user: 0 }
        ];

        defaultLicenses.forEach(license => {
            if (!seen.has(license.license_name)) {
                seen.add(license.license_name);
                uniqueLicenses.push(license);
            }
        });
        
        return uniqueLicenses;
    };

    const getDefaultLicenseType = (user) => {
        // Departmana göre varsayılan lisans tipi belirleme
        switch (user.department?.toLowerCase()) {
            case 'engineering':
            case 'development':
                return 'MICROSOFT TEAMS PREMIUM';
            case 'sales':
            case 'marketing':
                return 'MICROSOFT TEAMS BUSINESS';
            case 'human resources':
            case 'hr':
                return 'MICROSOFT TEAMS STANDARD';
            case 'finance':
            case 'accounting':
                return 'MICROSOFT TEAMS BUSINESS BASIC';
            default:
                return 'MICROSOFT TEAMS (FREE)';
        }
    };

    // Lisans kullanım oranını hesapla (varsayılan lisansları da dahil et)
    const calculateLicenseUtilization = () => {
        const totalUsers = users.length;
        const assignedLicenses = users.map(user => {
            const userLicense = licenses.find(license => 
                usageStats.some(stat => 
                    stat.user_id === user.user_id && stat.license_id === license.license_id
                )
            );
            return userLicense?.license_name || getDefaultLicenseType(user);
        });

        return Math.round((assignedLicenses.length / totalUsers) * 100) || 0;
    };

    return (
        <DashboardContainer>
            <MainContent>
            <Header>
                    <HeaderLeft>
                        <LogoSection>
                            <LogoImage src="/logo-gray.png" alt="Logo" />
                            <LogoCredit>by Eren Ayvaz</LogoCredit>
                        </LogoSection>
                        <div>
                            <HeaderTitle>Cloud-SaaS Analytics & Integration Hub</HeaderTitle>
                            <HeaderSubtitle>Enhanced Cloud-SaaS Management Prototype Integration and Analytics Tool</HeaderSubtitle>
                        </div>
                    </HeaderLeft>
                    <HeaderRight>
                        <DashboardText onClick={() => window.location.reload()}>Refresh</DashboardText>
                    </HeaderRight>
            </Header>
            
            <StatsGrid>
                <StatCard>
                    <StatTitle>Active Users</StatTitle>
                    <StatValue>{statusData[0].value}</StatValue>
                </StatCard>
                <StatCard>
                    <StatTitle>Total Licenses</StatTitle>
                        <StatValue>{licenses.length}</StatValue>
                </StatCard>
                <StatCard>
                    <StatTitle>License Utilization Rate</StatTitle>
                    <StatValue>{calculateLicenseUtilization()}%</StatValue>
                </StatCard>
            </StatsGrid>

            <GridContainer>
                    <ChartCard>
                        <ChartTitle>License Cost Analysis</ChartTitle>
                        <ResponsiveContainer width="100%" height={380}>
                            <BarChart data={getUniqueLicenses(licenses)} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                    dataKey="license_name" 
                                    angle={-45} 
                                    textAnchor="end" 
                                    height={60}
                                    interval={0}
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis tick={{ fill: '#6b7280' }} />
                                <Tooltip
                                    formatter={(value) => [`$${value}`, 'Cost per User']}
                                    contentStyle={{
                                        background: '#fff',
                                        border: '1px solid #eaedf3',
                                        borderRadius: '4px'
                                    }}
                                />
                                <Bar dataKey="cost_per_user" fill="#0052CC" radius={[4, 4, 0, 0]}>
                                    {getUniqueLicenses(licenses).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>

                <ChartCard>
                    <ChartTitle>User Status Distribution</ChartTitle>
                    <PieChartContainer>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <PieChartLegend>
                            {statusData.map((entry, index) => (
                                <LegendItem key={`legend-${index}`}>
                                    <LegendColor color={COLORS[index % COLORS.length]} />
                                    <span>{entry.name}: {entry.value} Users ({((entry.value/users.length)*100).toFixed(1)}%)</span>
                                </LegendItem>
                            ))}
                        </PieChartLegend>
                    </PieChartContainer>
                    </ChartCard>
                </GridContainer>

                <GridContainer>
                    <ChartCard>
                        <ChartTitle>Department Distribution</ChartTitle>
                        <ResponsiveContainer width="100%" height={380}>
                            <BarChart data={departmentChartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                    dataKey="name" 
                                    angle={-45} 
                                    textAnchor="end" 
                                    height={60}
                                    interval={0}
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis tick={{ fill: '#6b7280' }} />
                                <Tooltip 
                                    formatter={(value, name) => [`${value} Users (${((value/users.length)*100).toFixed(1)}%)`, 'Count']}
                                    contentStyle={{
                                        background: '#fff',
                                        border: '1px solid #eaedf3',
                                        borderRadius: '4px'
                                    }}
                                />
                                <Bar dataKey="value" fill="#0052CC" radius={[4, 4, 0, 0]}>
                                    {departmentChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>

                <ChartCard>
                        <ChartTitle>Average Usage Time by Department</ChartTitle>
                        <ResponsiveContainer width="100%" height={380}>
                            <BarChart data={Object.entries(users.reduce((acc, user) => {
                                const userStats = usageStats.filter(stat => stat.user_id === user.user_id);
                                if (userStats.length > 0 && user.department) {
                                    const avgMinutes = userStats.reduce((sum, stat) => sum + stat.active_minutes, 0) / userStats.length;
                                    acc[user.department] = (acc[user.department] || 0) + avgMinutes;
                                }
                                return acc;
                            }, {})).map(([dept, minutes]) => ({
                                department: dept,
                                avgMinutes: Math.round(minutes)
                            }))}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                    dataKey="department" 
                                    angle={-45} 
                                    textAnchor="end" 
                                    height={60}
                                    interval={0}
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis tick={{ fill: '#6b7280' }} />
                                <Tooltip
                                    formatter={(value) => [`${value} minutes (${(value/60).toFixed(1)} hours)`, 'Average Usage']}
                                    contentStyle={{
                                        background: '#fff',
                                        border: '1px solid #eaedf3',
                                        borderRadius: '4px'
                                    }}
                                />
                                <Bar dataKey="avgMinutes" fill="#36B37E" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </GridContainer>

                <GridContainer>
                    <ChartCard>
                        <ChartTitle>License Utilization Trend</ChartTitle>
                        <ResponsiveContainer width="100%" height={380}>
                            <LineChart data={usageStats
                                .sort((a, b) => new Date(a.date) - new Date(b.date))
                                .reduce((acc, stat) => {
                                    const date = new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                    const existingData = acc.find(d => d.date === date);
                                    if (existingData) {
                                        existingData.activeUsers = (existingData.activeUsers || 0) + 1;
                                    } else {
                                        acc.push({ date, activeUsers: 1 });
                                    }
                                    return acc;
                                }, [])
                                .map(data => ({
                                    ...data,
                                    utilizationRate: Math.round((data.activeUsers / licenses.length) * 100)
                                }))}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                    dataKey="date" 
                                    angle={-45} 
                                    textAnchor="end" 
                                    height={60}
                                    interval={0}
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis tick={{ fill: '#6b7280' }} domain={[0, 100]} />
                                <Tooltip
                                    formatter={(value) => [`${value}%`, 'Utilization Rate']}
                                    contentStyle={{
                                        background: '#fff',
                                        border: '1px solid #eaedf3',
                                        borderRadius: '4px'
                                    }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="utilizationRate" 
                                    stroke="#6554C0" 
                                    strokeWidth={2}
                                    dot={{ fill: '#6554C0', strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartCard>

                <ChartCard>
                    <ChartTitle>Daily Usage Trend</ChartTitle>
                        <ResponsiveContainer width="100%" height={380}>
                        <LineChart data={usageData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="date" 
                                angle={-45} 
                                textAnchor="end" 
                                height={60}
                                interval={0}
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis tick={{ fill: '#6b7280' }} />
                            <Tooltip
                                formatter={(value) => [`${value} minutes (${(value/60).toFixed(1)} hours)`, 'Usage Time']}
                                contentStyle={{
                                    background: '#fff',
                                    border: '1px solid #eaedf3',
                                    borderRadius: '4px'
                                }}
                                labelFormatter={(label) => `Date: ${label}`}
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
                                    const userStats = usageStats.find(stat => stat.user_id === user.user_id);
                                    const userLicense = licenses.find(license => 
                                        usageStats.some(stat => 
                                            stat.user_id === user.user_id && stat.license_id === license.license_id
                                        )
                                    );
                                    
                                    const licenseType = standardizeLicenseName(userLicense?.license_name) || getDefaultLicenseType(user);
                                    
                                    return (
                                        <tr key={user.user_id}>
                                            <Td>{user.name} ({user.email})</Td>
                                            <Td>{user.department || 'General'}</Td>
                                            <Td>
                                                <StatusBadge data-active={user.status === 'active'}>
                                                    {user.status || 'inactive'}
                                                </StatusBadge>
                                            </Td>
                                            <Td>{licenseType}</Td>
                                            <Td>{userStats?.last_active_at ? new Date(userStats.last_active_at).toLocaleDateString() : 'Not Available'}</Td>
                                            <Td>{userStats?.active_minutes ? `${Math.round(userStats.active_minutes / 60)} hours` : 'Not Available'}</Td>
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

                {optimizations.length > 0 && (
                <OptimizationContainer>
                        <OptimizationSectionHeader>Optimization Recommendations</OptimizationSectionHeader>
                        <OptimizationFilters>
                            <OptimizationSearchInput
                                type="text"
                                placeholder="Search by user or recommendation..."
                                value={optimizationSearchTerm}
                                onChange={(e) => setOptimizationSearchTerm(e.target.value)}
                            />
                            <FilterSelect
                                value={licenseFilter}
                                onChange={(e) => setLicenseFilter(e.target.value)}
                            >
                                <option value="all">All Licenses</option>
                                {Array.from(new Set(licenses.map(license => standardizeLicenseName(license.license_name))))
                                    .sort()
                                    .map(licenseName => (
                                        <option key={licenseName} value={licenseName}>{licenseName}</option>
                                    ))
                                }
                            </FilterSelect>
                        </OptimizationFilters>
                        {filteredOptimizations.map((opt, index) => {
                            const user = users.find(u => u.user_id === opt.user_id);
                            const license = licenses.find(l => l.license_id === opt.license_id);
                            
                            return (
                        <OptimizationCard key={index}>
                                    <OptimizationCardHeader>
                                        <OptimizationUser>
                                            {user ? `${user.name} (${user.email})` : 'System Admin (admin@microsoft.com)'} - {standardizeLicenseName(license?.license_name) || 'Standard License'}
                                        </OptimizationUser>
                                        <OptimizationMeta>
                                            Department: {user?.department || 'General'}
                                        </OptimizationMeta>
                                    </OptimizationCardHeader>
                            {opt.recommendation_text}
                        </OptimizationCard>
                            );
                        })}
                </OptimizationContainer>
            )}
            </MainContent>
            <Copyright>
                © {new Date().getFullYear()} Raynet SaaS Optimization. All rights reserved.
            </Copyright>
        </DashboardContainer>
    );
};

export default Dashboard;
