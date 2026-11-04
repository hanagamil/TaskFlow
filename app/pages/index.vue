<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import type { ProjectStatus } from '~/types/project'

type StatusColor = 'primary' | 'warning' | 'neutral'

const projectStatusColors: Record<ProjectStatus, StatusColor> = {
  'Planning': 'neutral',
  'In progress': 'primary',
  'In review': 'warning'
}

const { projects, tasks } = useTaskFlowData()
const today = ref('')
const nextWeek = ref('')

function formatDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function formatDate(date: string) {
  return `${date.slice(8, 10)}/${date.slice(5, 7)}/${date.slice(0, 4)}`
}

function getProjectName(projectId: number) {
  return projects.value.find(project => project.id === projectId)?.name ?? 'Unknown project'
}

onMounted(() => {
  const localToday = new Date()
  today.value = formatDateKey(localToday)

  const localNextWeek = new Date(localToday.getFullYear(), localToday.getMonth(), localToday.getDate())
  localNextWeek.setDate(localNextWeek.getDate() + 7)
  nextWeek.value = formatDateKey(localNextWeek)
})

const totalProjects = computed(() => projects.value.length)
const openTasks = computed(() => tasks.value.filter(task => task.status !== 'Done').length)
const overdueTasks = computed(() => tasks.value.filter(task =>
  task.status !== 'Done'
  && today.value !== ''
  && task.dueDate < today.value
).length)
const upcomingTasks = computed(() => tasks.value
  .filter(task =>
    task.status !== 'Done'
    && today.value !== ''
    && task.dueDate >= today.value
    && task.dueDate <= nextWeek.value
  )
  .sort((firstTask, secondTask) => firstTask.dueDate.localeCompare(secondTask.dueDate))
  .slice(0, 3))
const upcomingDeadlines = computed(() => tasks.value.filter(task =>
  task.status !== 'Done'
  && today.value !== ''
  && task.dueDate >= today.value
  && task.dueDate <= nextWeek.value
).length)
const recentProjects = computed(() => projects.value.slice(0, 3))
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

        <ul
          v-if="recentProjects.length > 0"
          class="divide-y divide-default"
        >
          <li
            v-for="project in recentProjects"
            :key="project.id"
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
              :color="projectStatusColors[project.status]"
              variant="subtle"
              class="shrink-0"
            >
              {{ project.status }}
            </UBadge>
          </li>
        </ul>
        <p
          v-else
          class="py-3 text-sm text-muted"
        >
          No projects yet. Create a project to see it here.
        </p>
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

        <ul
          v-if="upcomingTasks.length > 0"
          class="divide-y divide-default"
        >
          <li
            v-for="task in upcomingTasks"
            :key="task.id"
            class="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
          >
            <div class="min-w-0">
              <p class="truncate text-sm font-medium text-highlighted">
                {{ task.name }}
              </p>
              <p class="mt-1 truncate text-xs text-muted">
                {{ getProjectName(task.projectId) }}
              </p>
            </div>
            <time
              :datetime="task.dueDate"
              class="shrink-0 text-sm text-muted"
            >
              {{ formatDate(task.dueDate) }}
            </time>
          </li>
        </ul>
        <p
          v-else
          class="py-3 text-sm text-muted"
        >
          No upcoming tasks in the next 7 days.
        </p>
      </UCard>
    </div>
  </div>
</template>
