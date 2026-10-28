<script setup lang="ts">
import Draggable from 'vuedraggable'
import { parseDate, type DateValue } from '@internationalized/date'
import { computed, reactive, ref, watch } from 'vue'

type TaskStatus = 'To Do' | 'In Progress' | 'Done'
type StatusColor = 'neutral' | 'info' | 'success'

interface Task {
  id: number
  name: string
  description: string
  project: string
  dueDate: string
  status: TaskStatus
}

interface TaskColumn {
  id: string
  title: TaskStatus
  icon: string
  color: StatusColor
}

interface SortableMoveEvent {
  to: HTMLElement
}

interface SortableChangeEvent {
  added?: {
    element: Task
  }
}

const searchQuery = ref('')
const activeMobileStatus = ref<TaskStatus>('To Do')
const draggedTaskId = ref<number | null>(null)
const activeDropStatus = ref<TaskStatus | null>(null)
const dragBoardRevision = ref(0)
const toast = useToast()
const isCreateTaskModalOpen = ref(false)
const isTaskSubmitting = ref(false)
const hasAttemptedTaskSubmit = ref(false)
const isTaskDueDatePickerOpen = ref(false)
const touchedTaskFields = reactive({ name: false, project: false, dueDate: false })

const taskForm = reactive({
  name: '',
  description: '',
  project: '',
  dueDate: '',
  status: 'To Do' as TaskStatus
})

const columns: TaskColumn[] = [
  { id: 'todo', title: 'To Do', icon: 'i-lucide-list-todo', color: 'neutral' },
  { id: 'in-progress', title: 'In Progress', icon: 'i-lucide-loader-circle', color: 'info' },
  { id: 'done', title: 'Done', icon: 'i-lucide-circle-check', color: 'success' }
]

const statusIndicatorClasses: Record<StatusColor, string> = {
  neutral: 'text-muted',
  info: 'text-info',
  success: 'text-success'
}

const statusOptions = columns.map(column => ({
  label: column.title,
  value: column.title
}))

const statusControlClasses: Record<TaskStatus, string> = {
  'To Do': 'border border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800',
  'In Progress': 'border border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-200 dark:hover:bg-blue-950/60',
  'Done': 'border border-success/30 bg-success/5 text-success hover:bg-success/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-success/50'
}

const statusDotClasses: Record<TaskStatus, string> = {
  'To Do': 'bg-slate-500',
  'In Progress': 'bg-blue-500',
  'Done': 'bg-success'
}

const projectOptions = computed(() => [...new Set(tasks.value.map(task => task.project))])
const projectSelectOptions = computed(() => projectOptions.value.map(project => ({ label: project, value: project })))

const taskDueDateCalendarValue = computed<DateValue | undefined>({
  get: () => taskForm.dueDate ? parseDate(taskForm.dueDate) : undefined,
  set: (date) => {
    taskForm.dueDate = date?.toString() ?? ''
    touchedTaskFields.dueDate = true
    isTaskDueDatePickerOpen.value = false
  }
})

const taskFormErrors = computed(() => ({
  name: taskForm.name.trim() ? '' : 'Enter a task name.',
  project: projectOptions.value.includes(taskForm.project) ? '' : 'Choose a project.',
  dueDate: taskForm.dueDate ? '' : 'Choose a due date.'
}))

const isTaskFormValid = computed(() => Object.values(taskFormErrors.value).every(error => !error))

function shouldShowTaskError(field: keyof typeof touchedTaskFields) {
  return hasAttemptedTaskSubmit.value || touchedTaskFields[field]
}

function resetTaskForm() {
  taskForm.name = ''
  taskForm.description = ''
  taskForm.project = ''
  taskForm.dueDate = ''
  taskForm.status = 'To Do'
  touchedTaskFields.name = false
  touchedTaskFields.project = false
  touchedTaskFields.dueDate = false
  hasAttemptedTaskSubmit.value = false
  isTaskDueDatePickerOpen.value = false
  isTaskSubmitting.value = false
}

function openCreateTaskModal() {
  resetTaskForm()
  isCreateTaskModalOpen.value = true
}

function createTask() {
  hasAttemptedTaskSubmit.value = true

  if (!isTaskFormValid.value) {
    return
  }

  isTaskSubmitting.value = true

  try {
    const task: Task = {
      id: Math.max(0, ...tasks.value.map(existingTask => existingTask.id)) + 1,
      name: taskForm.name.trim(),
      description: taskForm.description.trim(),
      project: taskForm.project,
      dueDate: taskForm.dueDate,
      status: taskForm.status
    }

    tasks.value.unshift(task)
    activeMobileStatus.value = task.status
    isCreateTaskModalOpen.value = false
    toast.add({
      title: 'Task created',
      description: `${task.name} was added to ${task.status}.`,
      color: 'success'
    })
  } catch {
    toast.add({
      title: 'Task could not be created',
      description: 'Please review the task details and try again.',
      color: 'error'
    })
  } finally {
    isTaskSubmitting.value = false
  }
}

watch(isCreateTaskModalOpen, (isOpen) => {
  if (!isOpen) {
    resetTaskForm()
  }
})
const tasks = ref<Task[]>([
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
])

const filteredTasks = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  if (!query) {
    return tasks.value
  }

  return tasks.value.filter(task => task.name.toLowerCase().includes(query))
})

const boardColumns = computed(() => columns.map(column => ({
  ...column,
  tasks: filteredTasks.value.filter(task => task.status === column.title)
})))

const activeMobileColumn = computed(() => boardColumns.value.find(column => column.title === activeMobileStatus.value) ?? boardColumns.value[0]!)

function formatDate(date: string) {
  return `${date.slice(8, 10)}/${date.slice(5, 7)}/${date.slice(0, 4)}`
}

function isTaskStatus(status: string | undefined): status is TaskStatus {
  return columns.some(column => column.title === status)
}

function handleDragStart(event: { item: HTMLElement }) {
  const taskId = Number(event.item.dataset.taskId)

  draggedTaskId.value = Number.isNaN(taskId) ? null : taskId
  activeDropStatus.value = null
}

function handleDragMove(event: SortableMoveEvent) {
  const targetStatus = event.to.dataset.status

  if (
    draggedTaskId.value === null
    || !tasks.value.some(task => task.id === draggedTaskId.value)
    || !isTaskStatus(targetStatus)
  ) {
    activeDropStatus.value = null
    return false
  }

  activeDropStatus.value = targetStatus
  return true
}

function showStatusUpdateError() {
  dragBoardRevision.value += 1
  activeDropStatus.value = null
  toast.add({
    title: 'Task status could not be changed',
    description: 'The task stayed in its previous column. Please try again.',
    color: 'error'
  })
}

function updateTaskStatus(taskId: number, status: string) {
  const task = tasks.value.find(item => item.id === taskId)

  if (!task || !isTaskStatus(status)) {
    showStatusUpdateError()
    return
  }

  const previousStatus = task.status

  try {
    task.status = status
  } catch {
    task.status = previousStatus
    showStatusUpdateError()
  }
}

function handleColumnChange(status: TaskStatus, event: SortableChangeEvent) {
  const taskId = event.added?.element.id

  if (taskId !== undefined) {
    updateTaskStatus(taskId, status)
  }
}

function handleDragEnd() {
  draggedTaskId.value = null
  activeDropStatus.value = null
}
</script>

<template>
  <div class="space-y-8">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-highlighted">
          All Tasks
        </h1>
        <p class="mt-2 text-muted">
          Organize your work and see what needs attention next.
        </p>
      </div>
      <UButton
        label="New Task"
        icon="i-lucide-plus"
        color="primary"
        class="self-start sm:self-auto"
        type="button"
        @click="openCreateTaskModal"
      />
    </div>

    <div class="w-full sm:max-w-sm">
      <UInput
        v-model="searchQuery"
        type="search"
        placeholder="Search tasks..."
        aria-label="Search tasks by name"
        class="w-full"
      >
        <template #leading>
          <UIcon
            name="i-lucide-search"
            class="size-4 text-muted"
            aria-hidden="true"
          />
        </template>
      </UInput>
    </div>

    <section
      aria-label="Task board"
      class="space-y-4"
    >
      <div
        v-if="filteredTasks.length === 0"
        class="rounded-xl border border-dashed border-default px-6 py-12 text-center"
        role="status"
        aria-live="polite"
      >
        <UIcon
          name="i-lucide-search-x"
          class="mx-auto size-8 text-dimmed"
          aria-hidden="true"
        />
        <h2 class="mt-4 font-semibold text-highlighted">
          No tasks found
        </h2>
        <p class="mt-2 text-sm text-muted">
          Try another task name or clear your search to see all tasks.
        </p>
        <UButton
          label="Clear search"
          color="neutral"
          variant="ghost"
          class="mt-3"
          @click="searchQuery = ''"
        />
      </div>

      <div
        v-else
        class="hidden items-start gap-4 lg:grid lg:grid-cols-3"
      >
        <section
          v-for="column in boardColumns"
          :key="column.id"
          :aria-labelledby="`task-column-${column.id}`"
          class="min-w-0 rounded-xl border p-4 transition-colors"
          :class="activeDropStatus === column.title ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-default bg-elevated'"
        >
          <div class="mb-4 flex items-center justify-between gap-3">
            <div class="flex min-w-0 items-center gap-2">
              <UIcon
                :name="column.icon"
                class="size-5 shrink-0"
                :class="statusIndicatorClasses[column.color]"
                aria-hidden="true"
              />
              <h2
                :id="`task-column-${column.id}`"
                class="truncate font-semibold text-highlighted"
              >
                {{ column.title }}
              </h2>
            </div>
            <UBadge
              :color="column.color"
              variant="subtle"
              :aria-label="`${column.tasks.length} ${column.title} tasks`"
            >
              {{ column.tasks.length }}
            </UBadge>
          </div>

          <Draggable
            :key="`${column.id}-${dragBoardRevision}`"
            :model-value="column.tasks"
            :group="{ name: 'task-statuses', pull: true, put: true }"
            item-key="id"
            :animation="180"
            :sort="false"
            draggable="[data-draggable-task]"
            filter="[data-column-empty]"
            ghost-class="opacity-40"
            chosen-class="task-drag-chosen"
            drag-class="shadow-lg"
            class="min-h-20 space-y-3 rounded-lg"
            :data-status="column.title"
            :move="handleDragMove"
            @start="handleDragStart"
            @change="handleColumnChange(column.title, $event)"
            @end="handleDragEnd"
          >
            <template #item="{ element: task }">
              <UCard
                :data-task-id="task.id"
                :aria-label="`Task ${task.name}, ${task.status}`"
                aria-roledescription="Draggable task"
                data-draggable-task
                class="border border-default shadow-sm"
              >
                <div class="flex items-start justify-between gap-3">
                  <h3 class="min-w-0 font-medium text-highlighted">
                    {{ task.name }}
                  </h3>
                  <UBadge
                    :color="column.color"
                    variant="subtle"
                    class="shrink-0"
                  >
                    {{ task.status }}
                  </UBadge>
                </div>
                <p class="mt-2 text-sm leading-relaxed text-muted">
                  {{ task.description }}
                </p>
                <div class="mt-4 flex flex-col gap-2 border-t border-default pt-3 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
                  <span class="flex min-w-0 items-center gap-1.5">
                    <UIcon
                      name="i-lucide-folder"
                      class="size-4 shrink-0"
                      aria-hidden="true"
                    />
                    <span class="truncate">{{ task.project }}</span>
                  </span>
                  <time
                    :datetime="task.dueDate"
                    class="flex shrink-0 items-center gap-1.5"
                  >
                    <UIcon
                      name="i-lucide-calendar-days"
                      class="size-4"
                      aria-hidden="true"
                    />
                    Due {{ formatDate(task.dueDate) }}
                  </time>
                </div>
              </UCard>
            </template>

            <template #footer>
              <div
                v-if="column.tasks.length === 0"
                data-column-empty
                class="rounded-lg border border-dashed border-default px-4 py-8 text-center"
                role="status"
                aria-live="polite"
              >
                <p class="text-sm text-muted">
                  No matching tasks in this column.
                </p>
              </div>
            </template>
          </Draggable>
        </section>
      </div>

      <section
        v-if="filteredTasks.length > 0"
        class="space-y-4 lg:hidden"
        aria-label="Tasks by status"
      >
        <div
          role="tablist"
          aria-label="Task status"
          class="grid grid-cols-3 gap-2"
        >
          <UButton
            v-for="column in boardColumns"
            :id="`mobile-task-tab-${column.id}`"
            :key="column.id"
            type="button"
            role="tab"
            :aria-selected="activeMobileStatus === column.title"
            :aria-controls="`mobile-task-panel-${column.id}`"
            :color="activeMobileStatus === column.title ? column.color : 'neutral'"
            :variant="activeMobileStatus === column.title ? 'subtle' : 'ghost'"
            class="flex min-h-14 w-full flex-col justify-center gap-0.5 px-1"
            @click="activeMobileStatus = column.title"
          >
            <span class="text-center text-xs">
              {{ column.title }}
            </span>
            <UBadge
              :color="column.color"
              variant="subtle"
              class="font-medium"
            >
              {{ column.tasks.length }}
              <span class="sr-only">tasks</span>
            </UBadge>
          </UButton>
        </div>

        <section
          :id="`mobile-task-panel-${activeMobileColumn.id}`"
          role="tabpanel"
          :aria-labelledby="`mobile-task-tab-${activeMobileColumn.id}`"
          :aria-label="`${activeMobileColumn.title} tasks`"
          class="space-y-3"
        >
          <div
            v-if="activeMobileColumn.tasks.length === 0"
            class="rounded-lg border border-dashed border-default px-4 py-8 text-center"
            role="status"
            aria-live="polite"
          >
            <p class="text-sm text-muted">
              No matching tasks in this column.
            </p>
          </div>

          <div
            v-else
            class="space-y-3"
          >
            <UCard
              v-for="task in activeMobileColumn.tasks"
              :key="task.id"
              class="border border-default shadow-sm"
            >
              <div class="flex items-start justify-between gap-3">
                <h3 class="min-w-0 font-medium text-highlighted">
                  {{ task.name }}
                </h3>
              </div>
              <p class="mt-2 text-sm leading-relaxed text-muted">
                {{ task.description }}
              </p>
              <div class="mt-4 flex flex-col gap-2 border-t border-default pt-3 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
                <span class="flex min-w-0 items-center gap-1.5">
                  <UIcon
                    name="i-lucide-folder"
                    class="size-4 shrink-0"
                    aria-hidden="true"
                  />
                  <span class="truncate">{{ task.project }}</span>
                </span>
                <time
                  :datetime="task.dueDate"
                  class="flex shrink-0 items-center gap-1.5"
                >
                  <UIcon
                    name="i-lucide-calendar-days"
                    class="size-4"
                    aria-hidden="true"
                  />
                  Due {{ formatDate(task.dueDate) }}
                </time>
              </div>
              <div class="mt-4 border-t border-default pt-3">
                <label
                  :for="`mobile-task-status-${task.id}`"
                  class="mb-1.5 block text-xs font-medium text-muted"
                >
                  Status
                </label>
                <USelect
                  :id="`mobile-task-status-${task.id}`"
                  :model-value="task.status"
                  :items="statusOptions"
                  :aria-label="`Change status for ${task.name}`"
                  :class="statusControlClasses[task.status]"
                  :ui="{ trailingIcon: 'text-current' }"
                  variant="none"
                  class="min-h-11 w-full font-medium"
                  @update:model-value="updateTaskStatus(task.id, $event)"
                >
                  <template #leading>
                    <span
                      class="size-2 shrink-0 rounded-full"
                      :class="statusDotClasses[task.status]"
                      aria-hidden="true"
                    />
                  </template>
                </USelect>
              </div>
            </UCard>
          </div>
        </section>
      </section>
    </section>

    <UModal
      v-model:open="isCreateTaskModalOpen"
      title="New task"
      description="Add task details and choose a due date from the calendar."
      class="w-[calc(100%-2rem)] max-w-2xl"
      scrollable
    >
      <template #body>
        <form
          id="create-task-form"
          class="space-y-5"
          novalidate
          @submit.prevent="createTask"
        >
          <div>
            <label
              for="task-name"
              class="mb-1.5 block text-sm font-medium text-highlighted"
            >
              Task name <span aria-hidden="true">*</span>
            </label>
            <UInput
              id="task-name"
              v-model="taskForm.name"
              placeholder="e.g. Prepare project brief"
              autocomplete="off"
              required
              :aria-invalid="shouldShowTaskError('name') && Boolean(taskFormErrors.name)"
              :aria-describedby="shouldShowTaskError('name') && taskFormErrors.name ? 'task-name-error' : undefined"
              @blur="touchedTaskFields.name = true"
            />
            <p
              v-if="shouldShowTaskError('name') && taskFormErrors.name"
              id="task-name-error"
              class="mt-1.5 text-sm text-error"
              role="alert"
            >
              {{ taskFormErrors.name }}
            </p>
          </div>

          <div>
            <label
              for="task-description"
              class="mb-1.5 block text-sm font-medium text-highlighted"
            >
              Description <span class="text-muted">(optional)</span>
            </label>
            <UTextarea
              id="task-description"
              v-model="taskForm.description"
              placeholder="What needs to be done?"
              :rows="3"
            />
          </div>

          <div>
            <label
              for="task-project"
              class="mb-1.5 block text-sm font-medium text-highlighted"
            >
              Project <span aria-hidden="true">*</span>
            </label>
            <USelect
              id="task-project"
              v-model="taskForm.project"
              :items="projectSelectOptions"
              placeholder="Select a project"
              required
              :aria-invalid="shouldShowTaskError('project') && Boolean(taskFormErrors.project)"
              :aria-describedby="shouldShowTaskError('project') && taskFormErrors.project ? 'task-project-error' : undefined"
              class="w-full"
              @blur="touchedTaskFields.project = true"
            />
            <p
              v-if="shouldShowTaskError('project') && taskFormErrors.project"
              id="task-project-error"
              class="mt-1.5 text-sm text-error"
              role="alert"
            >
              {{ taskFormErrors.project }}
            </p>
          </div>

          <div class="grid gap-5 sm:grid-cols-2">
            <div
              role="group"
              aria-labelledby="task-due-date-label"
              :aria-describedby="shouldShowTaskError('dueDate') && taskFormErrors.dueDate ? 'task-due-date-error' : undefined"
              :aria-invalid="shouldShowTaskError('dueDate') && Boolean(taskFormErrors.dueDate)"
              class="min-w-0"
            >
              <div class="flex items-center justify-between gap-3">
                <p
                  id="task-due-date-label"
                  class="text-sm font-medium text-highlighted"
                >
                  Due date <span aria-hidden="true">*</span>
                </p>
                <span class="text-xs text-muted">DD/MM/YYYY</span>
              </div>
              <UPopover
                v-model:open="isTaskDueDatePickerOpen"
                :content="{ align: 'center', side: 'bottom', sideOffset: 8, collisionPadding: 12 }"
                :ui="{ content: 'z-[60] w-[calc(100vw-2rem)] max-w-80 p-2' }"
                :modal="false"
                dismissible
              >
                <UButton
                  type="button"
                  color="neutral"
                  variant="outline"
                  class="mt-2 flex min-h-11 w-full items-center justify-start gap-2"
                  aria-haspopup="dialog"
                  :aria-expanded="isTaskDueDatePickerOpen"
                  aria-controls="task-due-date-calendar"
                  :aria-invalid="shouldShowTaskError('dueDate') && Boolean(taskFormErrors.dueDate)"
                  :aria-describedby="shouldShowTaskError('dueDate') && taskFormErrors.dueDate ? 'task-due-date-error' : undefined"
                  @blur="touchedTaskFields.dueDate = true"
                >
                  <UIcon
                    name="i-lucide-calendar-days"
                    class="size-4 text-muted"
                    aria-hidden="true"
                  />
                  <span class="flex-1 text-left">
                    {{ taskForm.dueDate ? formatDate(taskForm.dueDate) : 'DD/MM/YYYY' }}
                  </span>
                </UButton>
                <template #content>
                  <div
                    id="task-due-date-calendar"
                    role="group"
                    aria-label="Task due date calendar"
                  >
                    <UCalendar
                      v-model="taskDueDateCalendarValue"
                      locale="en-GB"
                      aria-label="Choose task due date"
                      class="w-full"
                      @focusin="touchedTaskFields.dueDate = true"
                    />
                  </div>
                </template>
              </UPopover>
              <p
                v-if="shouldShowTaskError('dueDate') && taskFormErrors.dueDate"
                id="task-due-date-error"
                class="mt-2 text-sm text-error"
                role="alert"
              >
                {{ taskFormErrors.dueDate }}
              </p>
            </div>

            <div>
              <label
                for="task-status"
                class="mb-1.5 block text-sm font-medium text-highlighted"
              >
                Status
              </label>
              <USelect
                id="task-status"
                v-model="taskForm.status"
                :items="statusOptions"
                class="min-h-11 w-full"
              />
            </div>
          </div>
        </form>
      </template>

      <template #footer>
        <div class="flex w-full justify-end gap-3">
          <UButton
            label="Cancel"
            color="neutral"
            variant="ghost"
            :disabled="isTaskSubmitting"
            @click="isCreateTaskModalOpen = false"
          />
          <UButton
            label="Create task"
            type="submit"
            form="create-task-form"
            color="primary"
            :disabled="!isTaskFormValid || isTaskSubmitting"
            :loading="isTaskSubmitting"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>

<style scoped>
:deep(.task-drag-chosen) {
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--ui-primary) 30%, transparent);
}
</style>
