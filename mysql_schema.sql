-- ePolice MySQL Database Schema
-- Хүснэгтүүд: User, EmergencyCall, Message

CREATE TABLE IF NOT EXISTS `User` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) NOT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `EmergencyCall` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `type` VARCHAR(100) NOT NULL,
  `location` VARCHAR(100) NOT NULL,
  `priority` ENUM('high', 'medium', 'low') NOT NULL,
  `time` VARCHAR(50) NOT NULL,
  `officer` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `reportedBy` VARCHAR(100),
  `phone` VARCHAR(20),
  `dateTime` VARCHAR(50),
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `Message` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `senderId` INT NOT NULL,
  `receiverId` INT,
  `content` TEXT NOT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`senderId`) REFERENCES `User`(`id`),
  FOREIGN KEY (`receiverId`) REFERENCES `User`(`id`)
);
