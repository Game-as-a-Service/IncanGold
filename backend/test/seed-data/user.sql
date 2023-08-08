CREATE DATABASE IF NOT EXISTS test;

USE test;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- users.sql

CREATE TABLE IF NOT EXISTS User (
  User_id INTEGER AUTO_INCREMENT PRIMARY KEY,
  Username VARCHAR(50) UNIQUE, 
  Passwd VARCHAR(255),
  Email VARCHAR(255) UNIQUE,
  Google_id VARCHAR(255),
  Facebook_id VARCHAR(255)  
);

INSERT INTO User (Username, Password, Email)
VALUES
  ('johndoe', '123', 'johndoe@example.com'),
  ('janedoe', '456', 'janedoe@example.com'),
  ('bobsmith', '789', 'bobsmith@example.com');