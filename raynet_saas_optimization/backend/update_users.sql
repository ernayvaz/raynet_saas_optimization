-- Update existing users
UPDATE users SET status = 'inactive' WHERE user_id = '732056B314F3AF8D3F803785270395FD';

-- Active users
INSERT INTO users (user_id, email, department, status) VALUES
('ACT001', 'ahmet.yilmaz@raynet.com', 'Engineering', 'active'),
('ACT002', 'mehmet.kaya@raynet.com', 'Sales', 'active'),
('ACT003', 'ayse.demir@raynet.com', 'Marketing', 'active'),
('ACT004', 'fatma.celik@raynet.com', 'HR', 'active'),
('ACT005', 'ali.tekin@raynet.com', 'IT', 'active');

-- Inactive users
INSERT INTO users (user_id, email, department, status) VALUES
('INACT001', 'can.ozturk@raynet.com', 'Engineering', 'inactive'),
('INACT002', 'zeynep.arslan@raynet.com', 'Sales', 'inactive'),
('INACT003', 'berk.yildiz@raynet.com', 'Marketing', 'inactive'),
('INACT004', 'selin.koc@raynet.com', 'HR', 'inactive'),
('INACT005', 'deniz.sahin@raynet.com', 'IT', 'inactive');

-- User license relationships
INSERT INTO user_licenses (user_id, license_id, assigned_at, last_active_at) VALUES
-- Recent activity dates for active users
('ACT001', 'MS-TEAMS-001', NOW() - INTERVAL '1 day', NOW() - INTERVAL '2 hours'),
('ACT002', 'MS-TEAMS-001', NOW() - INTERVAL '2 days', NOW() - INTERVAL '4 hours'),
('ACT003', 'MS-TEAMS-001', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 hour'),
('ACT004', 'MS-TEAMS-001', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 hours'),
('ACT005', 'MS-TEAMS-001', NOW() - INTERVAL '2 days', NOW() - INTERVAL '5 hours'),

-- Old activity dates for inactive users
('INACT001', 'MS-TEAMS-001', NOW() - INTERVAL '60 days', NOW() - INTERVAL '45 days'),
('INACT002', 'MS-TEAMS-001', NOW() - INTERVAL '90 days', NOW() - INTERVAL '60 days'),
('INACT003', 'MS-TEAMS-001', NOW() - INTERVAL '45 days', NOW() - INTERVAL '40 days'),
('INACT004', 'MS-TEAMS-001', NOW() - INTERVAL '70 days', NOW() - INTERVAL '50 days'),
('INACT005', 'MS-TEAMS-001', NOW() - INTERVAL '80 days', NOW() - INTERVAL '55 days');

-- Usage statistics
INSERT INTO usage_stats (user_id, license_id, date, active_minutes, login_count) VALUES
-- High usage for active users
('ACT001', 'MS-TEAMS-001', CURRENT_DATE, 480, 12),
('ACT002', 'MS-TEAMS-001', CURRENT_DATE, 420, 10),
('ACT003', 'MS-TEAMS-001', CURRENT_DATE, 360, 8),
('ACT004', 'MS-TEAMS-001', CURRENT_DATE, 390, 9),
('ACT005', 'MS-TEAMS-001', CURRENT_DATE, 450, 11),

-- Low or zero usage for inactive users
('INACT001', 'MS-TEAMS-001', CURRENT_DATE - INTERVAL '45 days', 30, 1),
('INACT002', 'MS-TEAMS-001', CURRENT_DATE - INTERVAL '60 days', 15, 1),
('INACT003', 'MS-TEAMS-001', CURRENT_DATE - INTERVAL '40 days', 20, 1),
('INACT004', 'MS-TEAMS-001', CURRENT_DATE - INTERVAL '50 days', 10, 1),
('INACT005', 'MS-TEAMS-001', CURRENT_DATE - INTERVAL '55 days', 5, 1); 