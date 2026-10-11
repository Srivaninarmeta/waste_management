-- Smart Waste Management and Pickup System
-- MySQL Relational Database Schema

CREATE DATABASE IF NOT EXISTS waste_management_db 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

USE waste_management_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    locality VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_role (role),
    INDEX idx_user_locality (locality),
    INDEX idx_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Pickup Requests Table
CREATE TABLE IF NOT EXISTS pickup_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    request_number VARCHAR(50) NOT NULL UNIQUE,
    resident_id BIGINT NOT NULL,
    assigned_worker_id BIGINT NULL,
    waste_category VARCHAR(50) NOT NULL,
    description TEXT NULL,
    pickup_address VARCHAR(255) NOT NULL,
    locality VARCHAR(100) NOT NULL,
    preferred_pickup_date DATE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    resident_instructions TEXT NULL,
    worker_notes TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    assigned_at DATETIME NULL,
    collected_at DATETIME NULL,
    CONSTRAINT fk_pickup_resident FOREIGN KEY (resident_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_pickup_worker FOREIGN KEY (assigned_worker_id) REFERENCES users (id) ON DELETE SET NULL,
    INDEX idx_pickup_status (status),
    INDEX idx_pickup_resident (resident_id),
    INDEX idx_pickup_worker (assigned_worker_id),
    INDEX idx_pickup_date (preferred_pickup_date),
    INDEX idx_pickup_locality (locality),
    INDEX idx_pickup_category (waste_category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Pickup Status History Table
CREATE TABLE IF NOT EXISTS pickup_status_histories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pickup_request_id BIGINT NOT NULL,
    previous_status VARCHAR(30) NULL,
    new_status VARCHAR(30) NOT NULL,
    changed_by_user_id BIGINT NOT NULL,
    notes TEXT NULL,
    changed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_history_request FOREIGN KEY (pickup_request_id) REFERENCES pickup_requests (id) ON DELETE CASCADE,
    CONSTRAINT fk_history_user FOREIGN KEY (changed_by_user_id) REFERENCES users (id) ON DELETE RESTRICT,
    INDEX idx_history_request (pickup_request_id),
    INDEX idx_history_changed_by (changed_by_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
