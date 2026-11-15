import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  lms: router({
    courses: publicProcedure.query(() => db.listCourses()),
    courseBySlug: publicProcedure.input(z.object({ slug: z.string().min(1) })).query(({ input }) => db.getCourseBySlug(input.slug)),
    completeLesson: protectedProcedure.input(z.object({ courseId: z.number(), lessonId: z.number(), completed: z.boolean() })).mutation(({ ctx, input }) => db.markLessonComplete(ctx.user.id, input.courseId, input.lessonId, input.completed).then(() => ({ success: true }))),
    adminSummary: adminProcedure.query(() => db.getAdminSummary()),
  }),
});

export type AppRouter = typeof appRouter;
