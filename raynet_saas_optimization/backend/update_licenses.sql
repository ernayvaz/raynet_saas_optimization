-- Add licenses
INSERT INTO licenses (license_id, license_name, cost_per_user, vendor_support_ends_at) VALUES
('MS-TEAMS-001', 'Microsoft Teams (Free)', 0.00, NOW() + INTERVAL '365 days'),
('MS-TEAMS-002', 'Microsoft Teams (Premium)', 12.50, NOW() + INTERVAL '365 days'),
('MS-OFFICE-001', 'Microsoft Office 365', 8.25, NOW() + INTERVAL '365 days'); 