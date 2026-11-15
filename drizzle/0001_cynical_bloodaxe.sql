CREATE TABLE `activity` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`courseId` int,
	`lessonId` int,
	`type` enum('started','completed','enrolled','published') NOT NULL,
	`label` varchar(240) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `activity_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`slug` varchar(140) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_name_unique` UNIQUE(`name`),
	CONSTRAINT `categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`categoryId` int,
	`title` varchar(220) NOT NULL,
	`slug` varchar(240) NOT NULL,
	`description` text,
	`instructorName` varchar(160) NOT NULL,
	`level` enum('Beginner','Intermediate','Advanced') NOT NULL DEFAULT 'Beginner',
	`durationMinutes` int NOT NULL DEFAULT 60,
	`lessonCount` int NOT NULL DEFAULT 0,
	`accent` varchar(40) NOT NULL DEFAULT 'coral',
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courses_id` PRIMARY KEY(`id`),
	CONSTRAINT `courses_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `enrollments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseId` int NOT NULL,
	`enrolledAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `enrollments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lessons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`moduleId` int NOT NULL,
	`title` varchar(220) NOT NULL,
	`summary` text,
	`content` text,
	`durationMinutes` int NOT NULL DEFAULT 10,
	`orderIndex` int NOT NULL DEFAULT 0,
	`status` enum('draft','published') NOT NULL DEFAULT 'published',
	CONSTRAINT `lessons_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `modules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseId` int NOT NULL,
	`title` varchar(220) NOT NULL,
	`description` text,
	`orderIndex` int NOT NULL DEFAULT 0,
	CONSTRAINT `modules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseId` int NOT NULL,
	`lessonId` int NOT NULL,
	`completed` int NOT NULL DEFAULT 0,
	`lastViewedAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `progress_id` PRIMARY KEY(`id`)
);
