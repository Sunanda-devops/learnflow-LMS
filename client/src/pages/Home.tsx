import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CirclePlay,
  Clock3,
  Compass,
  Filter,
  GraduationCap,
  LayoutDashboard,
  Library,
  LogOut,
  Menu,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import type { LucideIcon } from "lucide-react";

const DEMO_COURSES: Course[] = [
  {
    id: "storytelling",
    slug: "strategic-storytelling",
    title: "Strategic Storytelling",
    description:
      "Turn complex thinking into stories people can remember, repeat, and act on.",
    category: "Communication",
    level: "Intermediate",
    duration: "4h 20m",
    lessons: 24,
    instructor: "Alex Morgan",
    initials: "AM",
    progress: 68,
    accent: "coral",
    nextLesson: "Build the narrative spine",
  },
  {
    id: "discovery",
    slug: "product-discovery-sprint",
    title: "Product Discovery Sprint",
    description:
      "A practical field guide for moving from fuzzy questions to useful evidence.",
    category: "Product",
    level: "Beginner",
    duration: "3h 40m",
    lessons: 19,
    instructor: "Priya Nair",
    initials: "PN",
    progress: 36,
    accent: "lilac",
    nextLesson: "Map the assumptions",
  },
  {
    id: "research",
    slug: "research-ops-foundations",
    title: "Research Ops Foundations",
    description:
      "Make customer learning easier to run, share, and repeat across your team.",
    category: "Systems",
    level: "Intermediate",
    duration: "2h 50m",
    lessons: 16,
    instructor: "Jules Park",
    initials: "JP",
    progress: 12,
    accent: "sage",
    nextLesson: "Create your research intake",
  },
  {
    id: "typescript",
    slug: "typescript-for-interface-builders",
    title: "TypeScript for Interface Builders",
    description:
      "Write safer UI code without losing the speed that made you love prototyping.",
    category: "Engineering",
    level: "Advanced",
    duration: "3h 10m",
    lessons: 12,
    instructor: "Noah Williams",
    initials: "NW",
    progress: 0,
    accent: "blue",
    nextLesson: "Start the course",
  },
];

type Course = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  lessons: number;
  instructor: string;
  initials: string;
  progress: number;
  accent: "coral" | "lilac" | "sage" | "blue";
  nextLesson: string;
};

type Lesson = {
  id: string;
  title: string;
  summary: string;
  duration: string;
  completed?: boolean;
};

type Module = {
  title: string;
  caption: string;
  lessons: Lesson[];
};

const COURSE_MODULES: Record<string, Module[]> = {
  "strategic-storytelling": [
    {
      title: "Find the signal",
      caption: "Start with what matters",
      lessons: [
        {
          id: "storytelling-01",
          title: "Why stories move decisions",
          summary: "A short history of narrative as a decision tool.",
          duration: "08 min",
          completed: true,
        },
        {
          id: "storytelling-02",
          title: "Name the tension",
          summary: "Find the human question inside the business question.",
          duration: "12 min",
          completed: true,
        },
        {
          id: "storytelling-03",
          title: "Choose the audience",
          summary: "Make the listener part of the story architecture.",
          duration: "10 min",
          completed: true,
        },
      ],
    },
    {
      title: "Build the arc",
      caption: "Give the idea somewhere to go",
      lessons: [
        {
          id: "storytelling-04",
          title: "Build the narrative spine",
          summary: "Use a simple arc to make complex thinking memorable.",
          duration: "16 min",
        },
        {
          id: "storytelling-05",
          title: "Make the turn",
          summary:
            "Create the moment when the audience sees the new possibility.",
          duration: "14 min",
        },
        {
          id: "storytelling-06",
          title: "Edit for momentum",
          summary: "Remove the details that keep a good idea from moving.",
          duration: "11 min",
        },
      ],
    },
    {
      title: "Make it useful",
      caption: "End with a next step",
      lessons: [
        {
          id: "storytelling-07",
          title: "From story to decision",
          summary: "Turn a compelling narrative into a useful ask.",
          duration: "18 min",
        },
        {
          id: "storytelling-08",
          title: "Practice: the 90-second brief",
          summary: "Apply the framework to your own work.",
          duration: "22 min",
        },
      ],
    },
  ],
  "product-discovery-sprint": [
    {
      title: "Start with the unknown",
      caption: "Make space for better questions",
      lessons: [
        {
          id: "discovery-01",
          title: "What are we trying to learn?",
          summary: "Separate assumptions from evidence.",
          duration: "11 min",
          completed: true,
        },
        {
          id: "discovery-02",
          title: "Map the assumptions",
          summary: "See the risks hiding inside a confident roadmap.",
          duration: "14 min",
        },
      ],
    },
    {
      title: "Gather useful evidence",
      caption: "Go where the signal is",
      lessons: [
        {
          id: "discovery-03",
          title: "Write a learning brief",
          summary: "Give research a clear point of view.",
          duration: "17 min",
        },
        {
          id: "discovery-04",
          title: "Run the first conversation",
          summary: "A simple guide to asking better questions.",
          duration: "20 min",
        },
      ],
    },
  ],
  "research-ops-foundations": [
    {
      title: "Make learning repeatable",
      caption: "A system is a kindness",
      lessons: [
        {
          id: "research-01",
          title: "The research operating model",
          summary: "Build the smallest system that makes learning easier.",
          duration: "13 min",
        },
        {
          id: "research-02",
          title: "Create your research intake",
          summary: "Help teams ask for the right thing at the right time.",
          duration: "15 min",
        },
      ],
    },
  ],
  "typescript-for-interface-builders": [
    {
      title: "A safer canvas",
      caption: "Types without ceremony",
      lessons: [
        {
          id: "typescript-01",
          title: "The shape of a component",
          summary: "Use types to make your UI easier to change.",
          duration: "16 min",
        },
        {
          id: "typescript-02",
          title: "Props that explain themselves",
          summary: "Let your interfaces document the design.",
          duration: "19 min",
        },
      ],
    },
  ],
};

const navItems: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "My learning", href: "/courses", icon: Library },
  { label: "Explore", href: "/courses", icon: Compass },
];

function useCourses() {
  const { data } = trpc.lms.courses.useQuery(undefined, {
    retry: false,
    staleTime: 60_000,
  });
  const courses = useMemo(() => {
    if (!data?.length) return DEMO_COURSES;
    return data.map((course): Course => {
      const fallback =
        DEMO_COURSES.find(item => item.slug === course.slug) ?? DEMO_COURSES[0];
      return {
        ...fallback,
        id: String(course.id),
        slug: course.slug,
        title: course.title,
        description: course.description ?? fallback.description,
        level: course.level,
        duration: `${Math.floor(course.durationMinutes / 60)}h ${course.durationMinutes % 60}m`,
        lessons: course.lessonCount,
        instructor: course.instructorName,
        accent: (course.accent as Course["accent"]) || fallback.accent,
      };
    });
  }, [data]);
  return courses;
}

function AppShell({
  children,
  eyebrow,
}: {
  children: React.ReactNode;
  eyebrow: string;
}) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const displayName = user?.name?.split(" ")[0] || "Maya";
  const initials =
    user?.name
      ?.split(" ")
      .map(name => name[0])
      .join("")
      .slice(0, 2) || "MC";

  return (
    <div className="lf-app-shell">
      <aside className={`lf-sidebar ${mobileNavOpen ? "is-open" : ""}`}>
        <div className="lf-brand-lockup">
          <div className="lf-brand-mark">
            <span />
            <span />
            <span />
          </div>
          <span>LearnFlow</span>
        </div>
        <div className="lf-sidebar-label">Workspace</div>
        <nav className="lf-nav-list" aria-label="Primary navigation">
          {navItems.map(item => {
            const active =
              location === item.href ||
              (item.href === "/courses" && location.startsWith("/courses"));
            return (
              <Link
                key={`${item.label}-${item.href}`}
                href={item.href}
                onClick={() => setMobileNavOpen(false)}
                className={`lf-nav-item ${active ? "is-active" : ""}`}
              >
                <item.icon size={17} strokeWidth={active ? 2.4 : 1.8} />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <Link
            href="/admin"
            onClick={() => setMobileNavOpen(false)}
            className={`lf-nav-item ${location === "/admin" ? "is-active" : ""}`}
          >
            <ShieldCheck
              size={17}
              strokeWidth={location === "/admin" ? 2.4 : 1.8}
            />
            <span>Admin workspace</span>
            <span className="lf-nav-badge">New</span>
          </Link>
        </nav>
        <div className="lf-sidebar-divider" />
        <div className="lf-sidebar-label">Your rhythm</div>
        <div className="lf-streak-card">
          <div className="lf-streak-icon">
            <TrendingUp size={16} />
          </div>
          <div>
            <strong>4 day streak</strong>
            <span>Keep the momentum going</span>
          </div>
        </div>
        <div className="lf-sidebar-spacer" />
        <div className="lf-sidebar-footnote">
          <Sparkles size={15} />
          <span>One focused lesson is enough for today.</span>
        </div>
        <div className="lf-user-menu">
          <div className="lf-avatar">{initials}</div>
          <div className="lf-user-details">
            <strong>{user?.name || "Maya Chen"}</strong>
            <span>{user?.email || "Learner account"}</span>
          </div>
          {user ? (
            <button
              className="lf-icon-button"
              aria-label="Sign out"
              onClick={() => void logout()}
            >
              <LogOut size={15} />
            </button>
          ) : (
            <button
              className="lf-icon-button"
              aria-label="Sign in"
              onClick={() => startLogin()}
            >
              <ArrowRight size={15} />
            </button>
          )}
        </div>
      </aside>
      {mobileNavOpen && (
        <button
          className="lf-mobile-scrim"
          aria-label="Close menu"
          onClick={() => setMobileNavOpen(false)}
        />
      )}
      <main className="lf-main-canvas">
        <header className="lf-topbar">
          <div className="lf-topbar-left">
            <button
              className="lf-mobile-menu lf-icon-button"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={19} />
            </button>
            <span className="lf-topbar-eyebrow">{eyebrow}</span>
          </div>
          <div className="lf-topbar-right">
            <button className="lf-search-trigger">
              <Search size={16} />
              <span>Search courses</span>
              <kbd>⌘ K</kbd>
            </button>
            <button
              className="lf-icon-button lf-settings"
              aria-label="Settings"
            >
              <Settings2 size={18} />
            </button>
            <div className="lf-top-avatar">{initials}</div>
          </div>
        </header>
        <div className="lf-content-wrap">{children}</div>
      </main>
    </div>
  );
}

function ProgressBar({
  value,
  color = "coral",
}: {
  value: number;
  color?: Course["accent"];
}) {
  return (
    <div className={`lf-progress-track progress-${color}`}>
      <span style={{ width: `${value}%` }} />
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="lf-section-heading">
      {eyebrow && <span className="lf-kicker">{eyebrow}</span>}
      <div className="lf-section-heading-row">
        <h2>{title}</h2>
        {action}
      </div>
    </div>
  );
}

function CourseCard({
  course,
  compact = false,
}: {
  course: Course;
  compact?: boolean;
}) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className={`lf-course-card ${compact ? "is-compact" : ""}`}
    >
      <div className={`lf-course-art art-${course.accent}`}>
        <div className="lf-art-grid" />
        <span className="lf-course-art-label">{course.category}</span>
        <div className="lf-art-orbit" />
      </div>
      <div className="lf-course-card-body">
        <div className="lf-course-card-meta">
          <span>{course.level}</span>
          <span className="lf-meta-dot" />
          <span>{course.duration}</span>
        </div>
        <h3>{course.title}</h3>
        <p>{course.description}</p>
        <div className="lf-course-card-footer">
          <div className="lf-instructor">
            <span className="lf-mini-avatar">{course.initials}</span>
            <span>{course.instructor}</span>
          </div>
          <span className="lf-course-chevron">
            <ChevronRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}

function ContinueCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/learn/${course.id === "storytelling" ? "storytelling-04" : "discovery-02"}`}
      className="lf-focus-card"
    >
      <div className="lf-focus-card-top">
        <span className="lf-kicker">Today&apos;s focus</span>
        <span className="lf-focus-status">
          <span className="lf-status-dot" />
          In progress
        </span>
      </div>
      <div className="lf-focus-content">
        <div className="lf-play-orb">
          <Play size={18} fill="currentColor" />
        </div>
        <div>
          <h2>{course.nextLesson}</h2>
          <p>
            {course.title} <span>·</span> Module 2 of 5
          </p>
        </div>
      </div>
      <div className="lf-focus-footer">
        <div className="lf-focus-progress">
          <ProgressBar value={course.progress} />
          <span>{course.progress}% complete</span>
        </div>
        <span className="lf-continue-label">
          Continue <ArrowRight size={16} />
        </span>
      </div>
    </Link>
  );
}

export function HomePage() {
  const courses = useCourses();
  return (
    <AppShell eyebrow="Tuesday, November 15, 2026">
      <div className="lf-page-intro">
        <div>
          <span className="lf-kicker">Good morning, Maya</span>
          <h1>Make a little progress.</h1>
          <p>
            Pick up where your thinking left off, or make room for something
            new.
          </p>
        </div>
        <button className="lf-outline-button">
          <CalendarDays size={16} />
          View your week
        </button>
      </div>
      <ContinueCard course={courses[0]} />
      <div className="lf-dashboard-grid">
        <section>
          <SectionHeading
            eyebrow="Your learning"
            title="In motion"
            action={
              <Link href="/courses" className="lf-text-button">
                View all <ArrowRight size={15} />
              </Link>
            }
          />
          <div className="lf-course-list">
            {courses.slice(0, 3).map(course => (
              <CourseRow key={course.id} course={course} />
            ))}
          </div>
        </section>
        <aside className="lf-side-column">
          <section className="lf-up-next">
            <SectionHeading eyebrow="Coming up" title="Your next few steps" />
            <div className="lf-up-next-list">
              <ScheduleItem
                day="15"
                month="NOV"
                title="Build the narrative spine"
                meta="Strategic Storytelling · 16 min"
                accent="coral"
              />
              <ScheduleItem
                day="18"
                month="NOV"
                title="Map the assumptions"
                meta="Product Discovery · 14 min"
                accent="lilac"
              />
              <ScheduleItem
                day="21"
                month="NOV"
                title="Create your research intake"
                meta="Research Ops · 15 min"
                accent="sage"
              />
            </div>
            <Link href="/courses" className="lf-subtle-link">
              Open learning calendar <ArrowRight size={14} />
            </Link>
          </section>
          <section className="lf-activity-card">
            <SectionHeading eyebrow="Recent activity" title="Your rhythm" />
            <div className="lf-activity-line">
              <span className="lf-activity-dot coral" />
              <div>
                <strong>Lesson completed</strong>
                <span>Why stories move decisions</span>
              </div>
              <time>2h</time>
            </div>
            <div className="lf-activity-line">
              <span className="lf-activity-dot lilac" />
              <div>
                <strong>Course joined</strong>
                <span>Research Ops Foundations</span>
              </div>
              <time>Yesterday</time>
            </div>
            <div className="lf-activity-line">
              <span className="lf-activity-dot sage" />
              <div>
                <strong>4 day streak</strong>
                <span>You&apos;re building a rhythm</span>
              </div>
              <time>Mon</time>
            </div>
          </section>
        </aside>
      </div>
    </AppShell>
  );
}

function CourseRow({ course }: { course: Course }) {
  return (
    <Link href={`/courses/${course.slug}`} className="lf-course-row">
      <div className={`lf-course-row-icon art-${course.accent}`}>
        <BookOpen size={17} />
      </div>
      <div className="lf-course-row-info">
        <div className="lf-course-row-title">
          <strong>{course.title}</strong>
          <span>{course.progress}%</span>
        </div>
        <div className="lf-course-row-meta">
          <span>{course.category}</span>
          <span className="lf-meta-dot" />
          <span>{course.lessons} lessons</span>
        </div>
        <ProgressBar value={course.progress} color={course.accent} />
      </div>
      <ChevronRight className="lf-course-row-arrow" size={17} />
    </Link>
  );
}

function ScheduleItem({
  day,
  month,
  title,
  meta,
  accent,
}: {
  day: string;
  month: string;
  title: string;
  meta: string;
  accent: Course["accent"];
}) {
  return (
    <div className="lf-schedule-item">
      <div className={`lf-date-tile ${accent}`}>
        <strong>{day}</strong>
        <span>{month}</span>
      </div>
      <div className="lf-schedule-copy">
        <strong>{title}</strong>
        <span>{meta}</span>
      </div>
      <MoreHorizontal size={16} className="lf-muted-icon" />
    </div>
  );
}

export function CatalogPage() {
  const courses = useCourses();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All courses");
  const categories = [
    "All courses",
    ...Array.from(new Set(courses.map(course => course.category))),
  ];
  const filtered = courses.filter(
    course =>
      `${course.title} ${course.description} ${course.category}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (category === "All courses" || course.category === category)
  );
  return (
    <AppShell eyebrow="Explore the library">
      <div className="lf-page-intro catalog-intro">
        <div>
          <span className="lf-kicker">The library</span>
          <h1>Find your next thread.</h1>
          <p>Short, focused courses for work that keeps changing.</p>
        </div>
        <div className="lf-catalog-count">
          <strong>{courses.length}</strong>
          <span>courses in the library</span>
        </div>
      </div>
      <div className="lf-filter-bar">
        <div className="lf-search-field">
          <Search size={17} />
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search by topic, skill, or instructor"
            aria-label="Search courses"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear search">
              <X size={15} />
            </button>
          )}
        </div>
        <div className="lf-filter-pills">
          {categories.map(item => (
            <button
              key={item}
              className={category === item ? "is-active" : ""}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <button className="lf-filter-button">
          <Filter size={16} />
          Filters
        </button>
      </div>
      <div className="lf-catalog-layout">
        <section>
          <div className="lf-results-header">
            <span>
              {filtered.length} {filtered.length === 1 ? "result" : "results"}
            </span>
            <button className="lf-sort-button">
              Recommended <ChevronRight size={14} />
            </button>
          </div>
          <div className="lf-catalog-grid">
            {filtered.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="lf-empty-state">
              <Compass size={24} />
              <strong>No courses match that search.</strong>
              <span>Try another phrase or reset the filters.</span>
              <button
                className="lf-text-button"
                onClick={() => {
                  setQuery("");
                  setCategory("All courses");
                }}
              >
                Reset search
              </button>
            </div>
          )}
        </section>
        <aside className="lf-library-note">
          <span className="lf-kicker">A note from the studio</span>
          <h3>Learning works better in small pieces.</h3>
          <p>
            Choose one course, make one useful thing, and leave a clear trail
            for your future self.
          </p>
          <div className="lf-note-line">
            <Sparkles size={15} />
            Designed for your real work.
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

export function CourseDetailPage({ slug }: { slug: string }) {
  const courses = useCourses();
  const course = courses.find(item => item.slug === slug) ?? courses[0];
  const courseDetail = trpc.lms.courseBySlug.useQuery(
    { slug },
    { retry: false, staleTime: 60_000 }
  );
  const modules = courseDetail.data?.modules?.length
    ? courseDetail.data.modules.map(module => ({
        title: module.title,
        caption:
          module.description ?? "Work through this module at your own pace.",
        lessons: module.lessons.map(lesson => ({
          id: String(lesson.id),
          title: lesson.title,
          summary: lesson.summary ?? "A focused lesson in this course.",
          duration: `${lesson.durationMinutes} min`,
          completed: false,
        })),
      }))
    : (COURSE_MODULES[course.slug] ?? COURSE_MODULES["strategic-storytelling"]);
  const totalLessons = modules.reduce(
    (sum, module) => sum + module.lessons.length,
    0
  );
  const completedLessons = modules.reduce(
    (sum, module) =>
      sum + module.lessons.filter(lesson => lesson.completed).length,
    0
  );
  const nextLesson =
    modules
      .flatMap(module => module.lessons)
      .find(lesson => !lesson.completed) ?? modules[0].lessons[0];
  return (
    <AppShell eyebrow="Course detail">
      <div className="lf-course-hero">
        <Link href="/courses" className="lf-back-link">
          <ArrowLeft size={15} />
          Back to library
        </Link>
        <div className="lf-course-hero-main">
          <div>
            <div className="lf-course-card-meta">
              <span>{course.category}</span>
              <span className="lf-meta-dot" />
              <span>{course.level}</span>
              <span className="lf-meta-dot" />
              <span>{course.duration}</span>
            </div>
            <h1>{course.title}</h1>
            <p>{course.description}</p>
            <div className="lf-course-hero-byline">
              <span className="lf-mini-avatar">{course.initials}</span>
              <span>
                Led by <strong>{course.instructor}</strong>
              </span>
            </div>
          </div>
          <div className={`lf-course-hero-art art-${course.accent}`}>
            <div className="lf-art-grid" />
            <div className="lf-art-orbit" />
            <span>{course.category}</span>
          </div>
        </div>
      </div>
      <div className="lf-course-stat-row">
        <div>
          <span className="lf-stat-number">
            {completedLessons}/{totalLessons}
          </span>
          <span>lessons complete</span>
        </div>
        <div>
          <span className="lf-stat-number">{course.duration}</span>
          <span>total learning time</span>
        </div>
        <div>
          <span className="lf-stat-number">{course.level}</span>
          <span>course level</span>
        </div>
        <Link href={`/learn/${nextLesson.id}`} className="lf-primary-button">
          {completedLessons ? "Continue course" : "Start course"}
          <ArrowRight size={16} />
        </Link>
      </div>
      <div className="lf-course-body">
        <section>
          <SectionHeading
            eyebrow="The curriculum"
            title="A clear path through the work"
          />
          <div className="lf-module-list">
            {modules.map((module, index) => (
              <ModuleCard key={module.title} module={module} index={index} />
            ))}
          </div>
        </section>
        <aside>
          <div className="lf-course-sidebar-card">
            <span className="lf-kicker">Your progress</span>
            <div className="lf-big-progress">
              <strong>{course.progress}%</strong>
              <ProgressBar value={course.progress} color={course.accent} />
            </div>
            <p>Keep going. The next lesson is ready when you are.</p>
            <Link
              href={`/learn/${nextLesson.id}`}
              className="lf-outline-button full-width"
            >
              Open next lesson <ArrowRight size={15} />
            </Link>
          </div>
          <div className="lf-course-sidebar-card quiet">
            <span className="lf-kicker">What you&apos;ll make</span>
            <ul>
              <li>
                <Check size={14} />A reusable narrative spine
              </li>
              <li>
                <Check size={14} />A sharper point of view
              </li>
              <li>
                <Check size={14} />A 90-second practice brief
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

function ModuleCard({ module, index }: { module: Module; index: number }) {
  const [open, setOpen] = useState(index === 1 || index === 0);
  const complete = module.lessons.filter(lesson => lesson.completed).length;
  return (
    <div className={`lf-module-card ${open ? "is-open" : ""}`}>
      <button className="lf-module-header" onClick={() => setOpen(!open)}>
        <span className="lf-module-number">0{index + 1}</span>
        <span className="lf-module-name">
          <strong>{module.title}</strong>
          <small>{module.caption}</small>
        </span>
        <span className="lf-module-count">
          {complete}/{module.lessons.length} complete
        </span>
        <ChevronRight size={18} className="lf-module-chevron" />
      </button>
      {open && (
        <div className="lf-lesson-list">
          {module.lessons.map(lesson => (
            <Link
              key={lesson.id}
              href={`/learn/${lesson.id}`}
              className="lf-lesson-row"
            >
              <span
                className={`lf-lesson-state ${lesson.completed ? "is-complete" : ""}`}
              >
                {lesson.completed ? (
                  <Check size={13} />
                ) : (
                  <CirclePlay size={15} />
                )}
              </span>
              <span className="lf-lesson-copy">
                <strong>{lesson.title}</strong>
                <small>{lesson.summary}</small>
              </span>
              <span className="lf-lesson-duration">
                <Clock3 size={13} />
                {lesson.duration}
              </span>
              <ChevronRight size={15} className="lf-muted-icon" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function LessonPage({ lessonId }: { lessonId: string }) {
  const courses = useCourses();
  const apiLesson = trpc.lms.lessonById.useQuery(
    { id: lessonId },
    { retry: false, staleTime: 60_000 }
  );
  const fallbackCourse =
    courses.find(item =>
      COURSE_MODULES[item.slug]?.some(module =>
        module.lessons.some(lesson => lesson.id === lessonId)
      )
    ) ?? courses[0];
  const course = apiLesson.data
    ? {
        ...fallbackCourse,
        id: String(apiLesson.data.course.id),
        slug: apiLesson.data.course.slug,
        title: apiLesson.data.course.title,
        description:
          apiLesson.data.course.description ?? fallbackCourse.description,
        level: apiLesson.data.course.level,
        duration: `${Math.floor(apiLesson.data.course.durationMinutes / 60)}h ${apiLesson.data.course.durationMinutes % 60}m`,
        lessons: apiLesson.data.course.lessonCount,
        instructor: apiLesson.data.course.instructorName,
      }
    : fallbackCourse;
  const modules = apiLesson.data
    ? [
        {
          title: apiLesson.data.module.title,
          caption: "Current module",
          lessons: [
            {
              id: lessonId,
              title: apiLesson.data.lesson.title,
              summary: apiLesson.data.lesson.summary ?? "",
              duration: `${apiLesson.data.lesson.durationMinutes} min`,
            },
          ],
        },
      ]
    : COURSE_MODULES[course.slug];
  const lessons = modules.flatMap(module => module.lessons);
  const currentIndex = Math.max(
    0,
    lessons.findIndex(lesson => lesson.id === lessonId)
  );
  const lesson = lessons[currentIndex] ?? lessons[0];
  const [completed, setCompleted] = useState(Boolean(lesson.completed));
  const completeMutation = trpc.lms.completeLesson.useMutation();
  const next = lessons[currentIndex + 1];
  const previous = lessons[currentIndex - 1];

  const markComplete = () => {
    const nextCompleted = !completed;
    setCompleted(nextCompleted);
    if (
      completeMutation &&
      Number.isInteger(Number(course.id)) &&
      Number.isInteger(Number(lesson.id))
    ) {
      void completeMutation
        .mutateAsync({
          courseId: Number(course.id),
          lessonId: Number(lesson.id),
          completed: nextCompleted,
        })
        .catch(() => undefined);
    }
  };

  return (
    <AppShell eyebrow="Lesson player">
      <div className="lf-lesson-layout">
        <aside className="lf-lesson-sidebar">
          <Link href={`/courses/${course.slug}`} className="lf-back-link">
            <ArrowLeft size={15} />
            Course overview
          </Link>
          <div className="lf-lesson-course-title">
            <span className="lf-kicker">Now learning</span>
            <strong>{course.title}</strong>
          </div>
          <div className="lf-lesson-outline">
            {modules.map(module => (
              <div key={module.title} className="lf-outline-module">
                <span>{module.title}</span>
                {module.lessons.map(item => (
                  <Link
                    key={item.id}
                    href={`/learn/${item.id}`}
                    className={`lf-outline-item ${item.id === lesson.id ? "is-current" : ""} ${item.completed || (item.id === lesson.id && completed) ? "is-complete" : ""}`}
                  >
                    <span>
                      {item.completed ||
                      (item.id === lesson.id && completed) ? (
                        <Check size={12} />
                      ) : (
                        <CirclePlay size={13} />
                      )}
                    </span>
                    {item.title}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </aside>
        <article className="lf-lesson-content">
          <div className="lf-lesson-breadcrumb">
            <span>{apiLesson.data?.module.title ?? "Current module"}</span>
            <ChevronRight size={13} />
            <span>{course.title}</span>
          </div>
          <div className="lf-lesson-heading">
            <span className="lf-kicker">
              Lesson {String(currentIndex + 1).padStart(2, "0")} ·{" "}
              {lesson.duration}
            </span>
            <h1>{lesson.title}</h1>
            <p>{lesson.summary}</p>
          </div>
          <div className="lf-lesson-reading">
            {apiLesson.data?.lesson.content ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: apiLesson.data.lesson.content,
                }}
              />
            ) : (
              <>
                <div className="lf-reading-lede">
                  The strongest stories don&apos;t add drama to an idea. They
                  reveal the shape that was already there.
                </div>
                <p>
                  A narrative spine is the simplest version of your idea that
                  still holds its tension. It helps your audience understand
                  where you are, what changed, and why the next move matters.
                </p>
                <h2>Start with the turn</h2>
                <p>
                  Before you write the opening, name the moment that changes the
                  way someone sees the problem. That turn gives the story
                  somewhere to travel. Everything else should make that shift
                  easier to feel.
                </p>
                <div className="lf-practice-card">
                  <div className="lf-practice-icon">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <span className="lf-kicker">Try it now</span>
                    <h3>Write your turn in one sentence.</h3>
                    <p>
                      “We thought we needed <em> X</em>, but the evidence showed
                      us <em> Y</em>.”
                    </p>
                  </div>
                </div>
                <h2>Keep the spine visible</h2>
                <p>
                  When the story gets crowded, return to the turn. If a detail
                  doesn&apos;t help your audience cross that bridge, save it for
                  later.
                </p>
              </>
            )}
          </div>
          <div className="lf-lesson-complete">
            <div>
              <span className="lf-kicker">A small finish line</span>
              <strong>
                {completed
                  ? "Lesson complete. Nice work."
                  : "Ready to mark this lesson complete?"}
              </strong>
            </div>
            <button
              className={
                completed
                  ? "lf-complete-button is-complete"
                  : "lf-primary-button"
              }
              onClick={markComplete}
            >
              {completed ? (
                <>
                  <Check size={16} />
                  Completed
                </>
              ) : (
                <>
                  Mark complete <Check size={16} />
                </>
              )}
            </button>
          </div>
          <div className="lf-lesson-footer-nav">
            {previous ? (
              <Link
                href={`/learn/${previous.id}`}
                className="lf-outline-button"
              >
                <ArrowLeft size={15} />
                Previous
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/learn/${next.id}`} className="lf-primary-button">
                Next lesson <ArrowRight size={16} />
              </Link>
            ) : (
              <Link
                href={`/courses/${course.slug}`}
                className="lf-primary-button"
              >
                Back to course <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </article>
      </div>
    </AppShell>
  );
}
export function AdminPage() {
  const courses = useCourses();
  const summary = trpc.lms.adminSummary.useQuery(undefined, { retry: false });
  const metrics = [
    {
      label: "Active learners",
      value: summary.data?.learnerCount ?? "284",
      change: "+12.4%",
      icon: Users,
    },
    {
      label: "Course enrollments",
      value: summary.data?.enrollmentCount ?? "1,248",
      change: "+8.2%",
      icon: BookOpen,
    },
    {
      label: "Lesson completion",
      value: "74.8%",
      change: "+5.6%",
      icon: CheckCircle2,
    },
    {
      label: "Published courses",
      value: summary.data?.courseCount ?? "18",
      change: "+3 this month",
      icon: GraduationCap,
    },
  ];
  return (
    <AppShell eyebrow="Admin workspace">
      <div className="lf-page-intro admin-intro">
        <div>
          <span className="lf-kicker">Studio overview</span>
          <h1>Make learning visible.</h1>
          <p>
            See what&apos;s moving, tune the curriculum, and help learners keep
            going.
          </p>
        </div>
        <button className="lf-primary-button">
          <Plus size={16} />
          New course
        </button>
      </div>
      <div className="lf-metric-grid">
        {metrics.map(metric => (
          <div className="lf-metric-card" key={metric.label}>
            <div className="lf-metric-top">
              <span>{metric.label}</span>
              <metric.icon size={17} />
            </div>
            <strong>{metric.value}</strong>
            <small>
              <TrendingUp size={13} />
              {metric.change}
            </small>
          </div>
        ))}
      </div>
      <div className="lf-admin-grid">
        <section className="lf-admin-panel">
          <div className="lf-panel-header">
            <div>
              <span className="lf-kicker">Curriculum</span>
              <h2>Courses at a glance</h2>
            </div>
            <button className="lf-icon-button">
              <MoreHorizontal size={17} />
            </button>
          </div>
          <div className="lf-admin-table">
            <div className="lf-table-head">
              <span>Course</span>
              <span>Enrollments</span>
              <span>Completion</span>
              <span>Status</span>
            </div>
            {courses.map((course, index) => (
              <div className="lf-table-row" key={course.id}>
                <div className="lf-table-course">
                  <span className={`lf-table-dot ${course.accent}`} />
                  <div>
                    <strong>{course.title}</strong>
                    <small>
                      {course.category} · {course.level}
                    </small>
                  </div>
                </div>
                <span>{[284, 198, 142, 96][index] ?? 76}</span>
                <div className="lf-table-progress">
                  <ProgressBar
                    value={[76, 58, 42, 31][index] ?? 24}
                    color={course.accent}
                  />
                  <span>{[76, 58, 42, 31][index] ?? 24}%</span>
                </div>
                <span className="lf-published-pill">Published</span>
              </div>
            ))}
          </div>
        </section>
        <aside className="lf-admin-side">
          <div className="lf-admin-panel compact-panel">
            <div className="lf-panel-header">
              <div>
                <span className="lf-kicker">Activity</span>
                <h2>What&apos;s happening</h2>
              </div>
              <BarChart3 size={18} className="lf-coral-icon" />
            </div>
            <div className="lf-admin-activity">
              <div>
                <span className="lf-activity-dot coral" />
                <p>
                  <strong>Priya Nair</strong> completed Product Discovery Sprint
                </p>
                <time>12m</time>
              </div>
              <div>
                <span className="lf-activity-dot lilac" />
                <p>
                  <strong>New enrollment</strong> in Strategic Storytelling
                </p>
                <time>34m</time>
              </div>
              <div>
                <span className="lf-activity-dot sage" />
                <p>
                  <strong>Alex Morgan</strong> published a new lesson
                </p>
                <time>1h</time>
              </div>
            </div>
            <Link href="/courses" className="lf-subtle-link">
              View all activity <ArrowRight size={14} />
            </Link>
          </div>
          <div className="lf-admin-panel compact-panel quick-actions">
            <span className="lf-kicker">Quick actions</span>
            <button>
              <Plus size={15} />
              Add a lesson
            </button>
            <button>
              <Users size={15} />
              Invite learners
            </button>
            <button>
              <Settings2 size={15} />
              Manage categories
            </button>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

export default HomePage;
