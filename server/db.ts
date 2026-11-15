import { and, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  activity,
  courses,
  enrollments,
  InsertUser,
  lessons,
  modules,
  progress,
  User,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) throw new Error("Database is not available");

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  values.lastSignedIn ??= new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db
    .insert(users)
    .values(values)
    .onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);
  return result[0];
}

export async function listCourses() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(courses)
    .where(eq(courses.status, "published"))
    .orderBy(desc(courses.updatedAt));
}

export async function getCourseBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const course = await db
    .select()
    .from(courses)
    .where(eq(courses.slug, slug))
    .limit(1);
  if (!course[0]) return null;
  const courseModules = await db
    .select()
    .from(modules)
    .where(eq(modules.courseId, course[0].id))
    .orderBy(modules.orderIndex);
  const courseLessons = courseModules.length
    ? await db
        .select()
        .from(lessons)
        .where(
          sql`${lessons.moduleId} in (${sql.join(
            courseModules.map(m => sql`${m.id}`),
            sql`, `
          )})`
        )
        .orderBy(lessons.orderIndex)
    : [];
  return {
    ...course[0],
    modules: courseModules.map(module => ({
      ...module,
      lessons: courseLessons.filter(lesson => lesson.moduleId === module.id),
    })),
  };
}

export async function getLessonById(lessonId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select({ lesson: lessons, module: modules, course: courses })
    .from(lessons)
    .innerJoin(modules, eq(lessons.moduleId, modules.id))
    .innerJoin(courses, eq(modules.courseId, courses.id))
    .where(and(eq(lessons.id, lessonId), eq(lessons.status, "published")))
    .limit(1);
  return result[0] ?? null;
}

export async function getCourseProgress(userId: number, courseId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      lessonId: progress.lessonId,
      completed: progress.completed,
      completedAt: progress.completedAt,
      lastViewedAt: progress.lastViewedAt,
    })
    .from(progress)
    .where(and(eq(progress.userId, userId), eq(progress.courseId, courseId)));
}

export async function markLessonComplete(
  userId: number,
  courseId: number,
  lessonId: number,
  completed: boolean
) {
  const db = await getDb();
  if (!db) return;
  const lesson = await db
    .select({ id: lessons.id, moduleId: lessons.moduleId })
    .from(lessons)
    .where(eq(lessons.id, lessonId))
    .limit(1);
  if (!lesson[0]) throw new Error("Lesson not found");
  const owningModule = await db
    .select({ courseId: modules.courseId })
    .from(modules)
    .where(eq(modules.id, lesson[0].moduleId))
    .limit(1);
  if (owningModule[0]?.courseId !== courseId)
    throw new Error("Lesson does not belong to course");
  const existing = await db
    .select()
    .from(progress)
    .where(
      and(
        eq(progress.userId, userId),
        eq(progress.courseId, courseId),
        eq(progress.lessonId, lessonId)
      )
    )
    .limit(1);
  const now = new Date();
  if (existing[0]) {
    await db
      .update(progress)
      .set({
        completed: completed ? 1 : 0,
        lastViewedAt: now,
        completedAt: completed ? now : null,
      })
      .where(eq(progress.id, existing[0].id));
  } else {
    await db.insert(progress).values({
      userId,
      courseId,
      lessonId,
      completed: completed ? 1 : 0,
      lastViewedAt: now,
      completedAt: completed ? now : null,
    });
  }
  await db.insert(activity).values({
    userId,
    courseId,
    lessonId,
    type: completed ? "completed" : "started",
    label: completed ? "Completed a lesson" : "Returned to a lesson",
  });
}

export async function getAdminSummary() {
  const db = await getDb();
  if (!db) return null;
  const [courseCount, learnerCount, enrollmentCount, completedCount] =
    await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(courses),
      db
        .select({ count: sql<number>`count(*)` })
        .from(users)
        .where(eq(users.role, "user")),
      db.select({ count: sql<number>`count(*)` }).from(enrollments),
      db
        .select({ count: sql<number>`count(*)` })
        .from(progress)
        .where(eq(progress.completed, 1)),
    ]);
  return {
    courseCount: Number(courseCount[0]?.count ?? 0),
    learnerCount: Number(learnerCount[0]?.count ?? 0),
    enrollmentCount: Number(enrollmentCount[0]?.count ?? 0),
    completedCount: Number(completedCount[0]?.count ?? 0),
  };
}

export type DbUser = User;
