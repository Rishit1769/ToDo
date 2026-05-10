-- Create a dedicated database for the application.
CREATE DATABASE IF NOT EXISTS todo_app;
USE todo_app;

-- Users are uniquely identified by username, and passwords are stored as hashes only.
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Todos are owned by a specific user and enforce ownership via foreign key.
CREATE TABLE IF NOT EXISTS todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  task VARCHAR(255) NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_todos_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
