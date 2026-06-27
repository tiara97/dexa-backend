CREATE DATABASE IF NOT EXISTS dexa_db;
USE dexa_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    role ENUM('admin', 'employee') NOT NULL,
    nip VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attendances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    check_in_time DATETIME NOT NULL,
    photo_url VARCHAR(255) NOT NULL,
    status INT NOT NULL COMMENT '1: intime, 2: late, 3: alfa',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert dummy admin user. Password is 'admin123' (bcrypt hashed)
-- Insert 10 dummy employee users. Password is 'password' (bcrypt hashed)
INSERT INTO users (nip, password, role, name, position) VALUES 
('10001', '$2a$10$XmN9F5/XU0Y1W9Z9K3QO1.Y6QW7v5X6Z3/0o7wYQYQYQYQYQYQYQ', 'admin', 'Administrator', 'Admin')
('10002', '$2b$10$5.5CokiB6YJKxZyjRweBFuWJJoJDATylLy2dKrfJS.6ibCVibeB0e', 'employee', 'user1', 'Software Engineer'),
('10003', '$2b$10$5.5CokiB6YJKxZyjRweBFuWJJoJDATylLy2dKrfJS.6ibCVibeB0e', 'employee', 'user2', 'Human Resources'),
('10004', '$2b$10$5.5CokiB6YJKxZyjRweBFuWJJoJDATylLy2dKrfJS.6ibCVibeB0e', 'employee', 'user3', 'Marketing Specialist'),
('10005', '$2b$10$5.5CokiB6YJKxZyjRweBFuWJJoJDATylLy2dKrfJS.6ibCVibeB0e', 'employee', 'user4', 'Sales Executive'),
('10006', '$2b$10$5.5CokiB6YJKxZyjRweBFuWJJoJDATylLy2dKrfJS.6ibCVibeB0e', 'employee', 'user5', 'Financial Analyst'),
('10007', '$2b$10$5.5CokiB6YJKxZyjRweBFuWJJoJDATylLy2dKrfJS.6ibCVibeB0e', 'employee', 'user6', 'Project Manager'),
('10008', '$2b$10$5.5CokiB6YJKxZyjRweBFuWJJoJDATylLy2dKrfJS.6ibCVibeB0e', 'employee', 'user7', 'UI/UX Designer'),
('10009', '$2b$10$5.5CokiB6YJKxZyjRweBFuWJJoJDATylLy2dKrfJS.6ibCVibeB0e', 'employee', 'user8', 'Data Analyst'),
('10010', '$2b$10$5.5CokiB6YJKxZyjRweBFuWJJoJDATylLy2dKrfJS.6ibCVibeB0e', 'employee', 'user9', 'Quality Assurance'),
('10011', '$2b$10$5.5CokiB6YJKxZyjRweBFuWJJoJDATylLy2dKrfJS.6ibCVibeB0e', 'employee', 'user10', 'System Administrator')
ON DUPLICATE KEY UPDATE nip = VALUES(nip);
