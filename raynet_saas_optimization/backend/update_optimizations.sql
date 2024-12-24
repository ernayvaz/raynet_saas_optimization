-- Clear existing optimization recommendations
TRUNCATE TABLE optimizations;

-- New optimization recommendations
INSERT INTO optimizations (user_id, license_id, recommendation_text, created_at) VALUES
-- Recommendations for inactive users
('INACT001', 'MS-TEAMS-001', 'User has been inactive for 45 days. Consider removing Microsoft Teams license for monthly savings of $12.50.', NOW()),
('INACT002', 'MS-TEAMS-001', 'No login activity detected for 60 days. Immediate license removal recommended. Potential annual savings: $150.', NOW()),
('INACT003', 'MS-TEAMS-001', 'Only 20 minutes of usage detected in the last 40 days. License requirement needs reassessment.', NOW()),
('INACT004', 'MS-TEAMS-001', 'Minimal usage (10 minutes) in the last 50 days. Consider removing license or switching to shared license.', NOW()),
('INACT005', 'MS-TEAMS-001', 'Critically low usage in the last 55 days. License suspension recommended.', NOW()),

-- Recommendations for active users with low usage
('ACT003', 'MS-TEAMS-001', 'Daily average usage below 6 hours. Consider downgrading from Premium to Standard license.', NOW()),
('ACT004', 'MS-TEAMS-001', 'Usage time below department average. License requirement needs review.', NOW()),

-- Notes for users not requiring optimization
('ACT001', 'MS-TEAMS-001', 'License usage at optimal level. No action required.', NOW()),
('ACT002', 'MS-TEAMS-001', 'Efficient license utilization. No optimization needed.', NOW()),
('ACT005', 'MS-TEAMS-001', 'Usage metrics at ideal levels. No changes recommended.', NOW()); 