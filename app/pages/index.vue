<script setup lang="ts">
type ProjectStatus = 'In progress' | 'In review' | 'Planning'
type StatusColor = 'primary' | 'warning' | 'neutral'

interface RecentProject {
  name: string
  status: ProjectStatus
  statusColor: StatusColor
}

interface UpcomingTask {
  name: string
  project: string
  dueDate: string
}

const recentProjects: RecentProject[] = [
  { name: 'Brand identity refresh', status: 'In progress', statusColor: 'primary' },
  { name: 'Client portal redesign', status: 'In review', statusColor: 'warning' },
  { name: 'Q4 marketing site', status: 'Planning', statusColor: 'neutral' }
]

const upcomingTasks: UpcomingTask[] = [
  { name: 'Finalize homepage wireframes', project: 'Client portal redesign', dueDate: 'Today' },
  { name: 'Review logo concepts', project: 'Brand identity refresh', dueDate: 'Tomorrow' },
  { name: 'Prepare launch checklist', project: 'Q4 marketing site', dueDate: 'Oct 30' }
]
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
              —
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
              —
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
              —
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
              —
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
