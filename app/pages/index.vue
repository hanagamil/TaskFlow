<script setup lang="ts">
import { computed } from 'vue'

type ProjectStatus = 'In progress' | 'In review' | 'Planning'
type StatusColor = 'primary' | 'warning' | 'neutral'
type TaskStatus = 'To Do' | 'In Progress' | 'Done'

interface Project {
  id: number
  name: string
  description: string
  status: ProjectStatus
  statusColor: StatusColor
  startDate: string
  endDate: string
}

interface Task {
  id: number
  name: string
  description: string
  project: string
  dueDate: string
  status: TaskStatus
}

interface UpcomingTask {
  name: string
  project: string
  dueDate: string
}

const projects: Project[] = [
  {
    id: 1,
    name: 'Brand identity refresh',
    description: 'A refreshed visual identity and brand system for a growing local business.',
    status: 'In progress',
    statusColor: 'primary',
    startDate: '2026-08-15',
    endDate: '2026-11-20'
  },
  {
    id: 2,
    name: 'Client portal redesign',
    description: 'A clearer, more useful client portal experience across desktop and mobile.',
    status: 'In review',
    statusColor: 'warning',
    startDate: '2026-09-01',
    endDate: '2026-12-05'
  },
  {
    id: 3,
    name: 'Q4 marketing site',
    description: 'A campaign website to introduce the upcoming product release.',
    status: 'Planning',
    statusColor: 'neutral',
    startDate: '2026-10-20',
    endDate: '2026-12-18'
  }
]

const tasks: Task[] = [
  {
    id: 1,
    name: 'Prepare project brief',
    description: 'Gather requirements and outline the project goals.',
    project: 'Brand identity refresh',
    dueDate: '2026-11-02',
    status: 'To Do'
  },
  {
    id: 2,
    name: 'Review launch checklist',
    description: 'Confirm the remaining items before the campaign goes live.',
    project: 'Q4 marketing site',
    dueDate: '2026-11-05',
    status: 'To Do'
  },
  {
    id: 3,
    name: 'Design dashboard wireframes',
    description: 'Map the main screens for the client portal experience.',
    project: 'Client portal redesign',
    dueDate: '2026-10-30',
    status: 'In Progress'
  },
  {
    id: 4,
    name: 'Create brand color palette',
    description: 'Explore a flexible palette for digital and print use.',
    project: 'Brand identity refresh',
    dueDate: '2026-11-01',
    status: 'In Progress'
  },
  {
    id: 5,
    name: 'Collect client feedback',
    description: 'Summarize notes from the latest design review.',
    project: 'Client portal redesign',
    dueDate: '2026-10-26',
    status: 'Done'
  },
  {
    id: 6,
    name: 'Draft homepage copy',
    description: 'Prepare first-pass copy for the campaign homepage.',
    project: 'Q4 marketing site',
    dueDate: '2026-10-24',
    status: 'Done'
  }
]

const recentProjects: Project[] = projects.slice(0, 3)

const upcomingTasks: UpcomingTask[] = [
  { name: 'Finalize homepage wireframes', project: 'Client portal redesign', dueDate: 'Today' },
  { name: 'Review logo concepts', project: 'Brand identity refresh', dueDate: 'Tomorrow' },
  { name: 'Prepare launch checklist', project: 'Q4 marketing site', dueDate: 'Oct 30' }
]

const today = new Date().toISOString().slice(0, 10)
const nextWeekDate = new Date(today + 'T00:00:00.000Z')
nextWeekDate.setUTCDate(nextWeekDate.getUTCDate() + 7)
const nextWeek = nextWeekDate.toISOString().slice(0, 10)

const totalProjects = computed(() => projects.length)
const openTasks = computed(() => tasks.filter(task => task.status !== 'Done').length)
const overdueTasks = computed(() => tasks.filter(task => task.status !== 'Done' && task.dueDate < today).length)
const upcomingDeadlines = computed(() => tasks.filter(task =>
  task.status !== 'Done'
  && task.dueDate >= today
  && task.dueDate <= nextWeek
).length)
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-2xl font-semibold text-highlighted">
        Dashboard
      </h1>
      <p class="mt-2 text-muted">
        A quick overview of your projects and tasks.
      </p>
    </div>

    <section
      aria-label="Dashboard summary"
      class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
    >
      <UCard class="border border-default shadow-sm">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-sm font-medium text-muted">
              Total Projects
            </p>
            <p class="mt-4 text-3xl font-semibold text-highlighted">
              {{ totalProjects }}
            </p>
          </div>
          <span class="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <UIcon
              name="i-lucide-folder-kanban"
              class="size-5"
              aria-hidden="true"
            />
          </span>
        </div>
      </UCard>

      <UCard class="border border-default shadow-sm">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-sm font-medium text-muted">
              Open Tasks
            </p>
            <p class="mt-4 text-3xl font-semibold text-highlighted">
              {{ openTasks }}
            </p>
          </div>
          <span class="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <UIcon
              name="i-lucide-list-checks"
              class="size-5"
              aria-hidden="true"
            />
          </span>
        </div>
      </UCard>

      <UCard class="border border-default shadow-sm">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-sm font-medium text-muted">
              Overdue Tasks
            </p>
            <p class="mt-4 text-3xl font-semibold text-highlighted">
              {{ overdueTasks }}
            </p>
          </div>
          <span class="flex size-11 shrink-0 items-center justify-center rounded-lg bg-error/10 text-error">
            <UIcon
              name="i-lucide-triangle-alert"
              class="size-5"
              aria-hidden="true"
            />
          </span>
        </div>
      </UCard>

      <UCard class="border border-default shadow-sm">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-sm font-medium text-muted">
              Upcoming Deadlines
            </p>
            <p class="mt-4 text-3xl font-semibold text-highlighted">
              {{ upcomingDeadlines }}
            </p>
          </div>
          <span class="flex size-11 shrink-0 items-center justify-center rounded-lg bg-warning/10 text-warning">
            <UIcon
              name="i-lucide-calendar-clock"
              class="size-5"
              aria-hidden="true"
            />
          </span>
        </div>
      </UCard>
    </section>

    <div class="grid gap-6 lg:grid-cols-2">
      <UCard class="border border-default shadow-sm">
        <template #header>
          <div class="flex items-center justify-between gap-4">
            <h2 class="font-semibold text-highlighted">
              Recent Projects
            </h2>
            <UButton
              label="View all"
              to="/projects"
              trailing-icon="i-lucide-arrow-right"
              color="primary"
              variant="link"
              size="sm"
            />
          </div>
        </template>

        <ul class="divide-y divide-default">
          <li
            v-for="project in recentProjects"
            :key="project.name"
            class="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
          >
            <div class="flex min-w-0 items-center gap-3">
              <UIcon
                name="i-lucide-folder"
                class="size-5 shrink-0 text-dimmed"
                aria-hidden="true"
              />
              <span class="truncate text-sm font-medium text-highlighted">{{ project.name }}</span>
            </div>
            <UBadge
              :color="project.statusColor"
              variant="subtle"
              class="shrink-0"
            >
              {{ project.status }}
            </UBadge>
          </li>
        </ul>
      </UCard>

      <UCard class="border border-default shadow-sm">
        <template #header>
          <div class="flex items-center justify-between gap-4">
            <h2 class="font-semibold text-highlighted">
              Upcoming Tasks
            </h2>
            <UButton
              label="View all"
              to="/tasks"
              trailing-icon="i-lucide-arrow-right"
              color="primary"
              variant="link"
              size="sm"
            />
          </div>
        </template>

        <ul class="divide-y divide-default">
          <li
            v-for="task in upcomingTasks"
            :key="task.name"
            class="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
          >
            <div class="min-w-0">
              <p class="truncate text-sm font-medium text-highlighted">
                {{ task.name }}
              </p>
              <p class="mt-1 truncate text-xs text-muted">
                {{ task.project }}
              </p>
            </div>
            <time class="shrink-0 text-sm text-muted">{{ task.dueDate }}</time>
          </li>
        </ul>
      </UCard>
    </div>
  </div>
</template>
