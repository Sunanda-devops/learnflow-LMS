import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }).notNull().unique(),
  slug: varchar("slug", { length: 140 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const courses = mysqlTable("courses", {
  id: int("id").autoincrement().primaryKey(),
  categoryId: int("categoryId"),
  title: varchar("title", { length: 220 }).notNull(),
  slug: varchar("slug", { length: 240 }).notNull().unique(),
  description: text("description"),
  instructorName: varchar("instructorName", { length: 160 }).notNull(),
  level: mysqlEnum("level", ["Beginner", "Intermediate", "Advanced"]).default("Beginner").notNull(),
  durationMinutes: int("durationMinutes").default(60).notNull(),
  lessonCount: int("lessonCount").default(0).notNull(),
  accent: varchar("accent", { length: 40 }).default("coral").notNull(),
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const modules = mysqlTable("modules", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId").notNull(),
  title: varchar("title", { length: 220 }).notNull(),
  description: text("description"),
  orderIndex: int("orderIndex").default(0).notNull(),
});

export const lessons = mysqlTable("lessons", {
  id: int("id").autoincrement().primaryKey(),
  moduleId: int("moduleId").notNull(),
  title: varchar("title", { length: 220 }).notNull(),
  summary: text("summary"),
  content: text("content"),
  durationMinutes: int("durationMinutes").default(10).notNull(),
  orderIndex: int("orderIndex").default(0).notNull(),
  status: mysqlEnum("status", ["draft", "published"]).default("published").notNull(),
});

export const enrollments = mysqlTable("enrollments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseId: int("courseId").notNull(),
  enrolledAt: timestamp("enrolledAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export const progress = mysqlTable("progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseId: int("courseId").notNull(),
  lessonId: int("lessonId").notNull(),
  completed: int("completed").default(0).notNull(),
  lastViewedAt: timestamp("lastViewedAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export const activity = mysqlTable("activity", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  courseId: int("courseId"),
  lessonId: int("lessonId"),
  type: mysqlEnum("type", ["started", "completed", "enrolled", "published"]).notNull(),
  label: varchar("label", { length: 240 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Course = typeof courses.$inferSelect;
export type Module = typeof modules.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
