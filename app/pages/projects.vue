<script setup lang="ts">
import { parseDate, type DateValue } from '@internationalized/date'
import { computed, nextTick, reactive, ref, watch } from 'vue'

type ProjectStatus = 'In progress' | 'In review' | 'Planning'
type StatusColor = 'primary' | 'warning' | 'neutral'
type ProjectField = 'name' | 'startDate' | 'endDate'
type DateField = 'startDate' | 'endDate'

interface Project {
  id: number
  name: string
  description: string
  status: ProjectStatus
  statusColor: StatusColor
  startDate: string
  endDate: string
}

const toast = useToast()
const searchQuery = ref('')
const isCreateModalOpen = ref(false)
const isDeleteConfirmationOpen = ref(false)
const isSubmitting = ref(false)
const editingProjectId = ref<number | null>(null)
const isEditingProject = computed(() => editingProjectId.value !== null)
const projectToDelete = ref<Project | null>(null)
const activeDatePicker = ref<DateField | null>(null)
const hasAttemptedSubmit = ref(false)

const projectForm = reactive({
  name: '',
  description: '',
  startDate: '',
  endDate: ''
})

const touched = reactive<Record<ProjectField, boolean>>({
  name: false,
  startDate: false,
  endDate: false
})

const projects = ref<Project[]>([
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
])

const startDateCalendarValue = computed<DateValue | undefined>({
  get: () => projectForm.startDate ? parseDate(projectForm.startDate) : undefined,
  set: (date) => {
    projectForm.startDate = date?.toString() ?? ''
    touched.startDate = true
    activeDatePicker.value = null
  }
})

const endDateCalendarValue = computed<DateValue | undefined>({
  get: () => projectForm.endDate ? parseDate(projectForm.endDate) : undefined,
  set: (date) => {
    projectForm.endDate = date?.toString() ?? ''
    touched.endDate = true
    activeDatePicker.value = null
  }
})

const isStartDatePickerOpen = computed({
  get: () => activeDatePicker.value === 'startDate',
  set: (open) => {
    activeDatePicker.value = open ? 'startDate' : activeDatePicker.value === 'startDate' ? null : activeDatePicker.value
  }
})

const isEndDatePickerOpen = computed({
  get: () => activeDatePicker.value === 'endDate',
  set: (open) => {
    activeDatePicker.value = open ? 'endDate' : activeDatePicker.value === 'endDate' ? null : activeDatePicker.value
  }
})

const errors = computed(() => ({
  name: projectForm.name.trim() ? '' : 'Enter a project name.',
  startDate: projectForm.startDate ? '' : 'Choose a start date.',
  endDate: !projectForm.endDate
    ? 'Choose an end date.'
    : projectForm.startDate && projectForm.endDate < projectForm.startDate
      ? 'End date must be on or after the start date.'
      : ''
}))

const isFormValid = computed(() => Object.values(errors.value).every(error => !error))

const filteredProjects = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  if (!query) {
    return projects.value
  }

  return projects.value.filter(project => project.name.toLowerCase().includes(query))
})

function shouldShowError(field: ProjectField) {
  return hasAttemptedSubmit.value || touched[field]
}

function formatDate(date: string) {
  return `${date.slice(8, 10)}/${date.slice(5, 7)}/${date.slice(0, 4)}`
}

function resetProjectForm() {
  editingProjectId.value = null
  activeDatePicker.value = null
  projectForm.name = ''
  projectForm.description = ''
  projectForm.startDate = ''
  projectForm.endDate = ''
  touched.name = false
  touched.startDate = false
  touched.endDate = false
  hasAttemptedSubmit.value = false
}

function openCreateModal() {
  resetProjectForm()
  isCreateModalOpen.value = true
}

const openEditProject = (project: Project) => {
  resetProjectForm()
  editingProjectId.value = project.id
  projectForm.name = project.name
  projectForm.description = project.description
  projectForm.startDate = project.startDate
  projectForm.endDate = project.endDate
  isCreateModalOpen.value = true
}

function cancelCreateProject() {
  isCreateModalOpen.value = false
  resetProjectForm()
}

function openDeleteConfirmation(project: Project) {
  projectToDelete.value = project
  isDeleteConfirmationOpen.value = true
}

function cancelDeleteProject() {
  isDeleteConfirmationOpen.value = false
  projectToDelete.value = null
}

function confirmDeleteProject() {
  const project = projectToDelete.value

  if (!project) {
    return
  }

  projects.value = projects.value.filter(currentProject => currentProject.id !== project.id)

  if (editingProjectId.value === project.id) {
    isCreateModalOpen.value = false
    resetProjectForm()
  }

  cancelDeleteProject()
  toast.add({
    title: 'Project deleted',
    description: project.name + ' was deleted successfully.',
    color: 'success'
  })
}

watch(isCreateModalOpen, (isOpen) => {
  if (!isOpen) {
    resetProjectForm()
  }
})

watch(isDeleteConfirmationOpen, (isOpen) => {
  if (!isOpen) {
    projectToDelete.value = null
  }
})

async function createProject() {
  hasAttemptedSubmit.value = true

  if (!isFormValid.value || isSubmitting.value) {
    return
  }

  isSubmitting.value = true
  await nextTick()

  try {
    const isEditing = editingProjectId.value !== null
    const projectName = projectForm.name.trim()

    if (editingProjectId.value !== null) {
      const project = projects.value.find(project => project.id === editingProjectId.value)

      if (!project) {
        return
      }

      Object.assign(project, {
        name: projectForm.name.trim(),
        description: projectForm.description.trim(),
        startDate: projectForm.startDate,
        endDate: projectForm.endDate
      })

      const query = searchQuery.value.trim().toLowerCase()
      if (query && !project.name.toLowerCase().includes(query)) {
        searchQuery.value = ''
      }
    } else {
      const nextId = Math.max(0, ...projects.value.map(project => project.id)) + 1

      projects.value.unshift({
        id: nextId,
        name: projectForm.name.trim(),
        description: projectForm.description.trim(),
        status: 'Planning',
        statusColor: 'neutral',
        startDate: projectForm.startDate,
        endDate: projectForm.endDate
      })
    }

    isCreateModalOpen.value = false
    resetProjectForm()
    toast.add({
      title: isEditing ? 'Project updated' : 'Project created',
      description: projectName + (isEditing ? ' was updated successfully.' : ' was created successfully.'),
      color: 'success'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="space-y-8">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-highlighted">
          Projects
        </h1>
        <p class="mt-2 text-muted">
          Keep track of your client work and project timelines.
        </p>
      </div>
      <UButton
        label="New Project"
        icon="i-lucide-plus"
        color="primary"
        class="self-start sm:self-auto"
        @click="openCreateModal"
      />
    </div>

    <div class="w-full sm:max-w-sm">
      <UInput
        v-model="searchQuery"
        type="search"
        placeholder="Search projects..."
        aria-label="Search projects by name"
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
      aria-label="Projects"
      class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
    >
      <UCard
        v-for="project in filteredProjects"
        :key="project.id"
        class="border border-default shadow-sm"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex min-w-0 items-start gap-3">
            <span class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UIcon
                name="i-lucide-folder-kanban"
                class="size-5"
                aria-hidden="true"
              />
            </span>
            <div class="min-w-0">
              <h2 class="truncate font-semibold text-highlighted">
                {{ project.name }}
              </h2>
              <p class="mt-2 text-sm leading-relaxed text-muted">
                {{ project.description }}
              </p>
            </div>
          </div>
          <div class="flex shrink-0 flex-col items-end gap-2">
            <UBadge
              :color="project.statusColor"
              variant="subtle"
            >
              {{ project.status }}
            </UBadge>
            <UTooltip text="Edit project">
              <UButton
                :aria-label="`Edit ${project.name}`"
                icon="i-lucide-pencil"
                color="neutral"
                variant="ghost"
                size="md"
                square
                class="size-9 shrink-0"
                @click="openEditProject(project)"
              />
            </UTooltip>
            <UTooltip text="Delete project">
              <UButton
                :aria-label="`Delete ${project.name}`"
                icon="i-lucide-trash-2"
                color="error"
                variant="ghost"
                size="md"
                square
                class="size-9 shrink-0 hover:bg-error/10"
                @click="openDeleteConfirmation(project)"
              />
            </UTooltip>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-4 border-t border-default pt-4">
          <div>
            <p class="text-xs font-medium text-muted">
              Start date
            </p>
            <time class="mt-1 block text-sm text-highlighted">{{ formatDate(project.startDate) }}</time>
          </div>
          <div>
            <p class="text-xs font-medium text-muted">
              End date
            </p>
            <time class="mt-1 block text-sm text-highlighted">{{ formatDate(project.endDate) }}</time>
          </div>
        </div>
      </UCard>

      <div
        v-if="filteredProjects.length === 0"
        class="col-span-full rounded-xl border border-dashed border-default px-6 py-12 text-center"
        role="status"
        aria-live="polite"
      >
        <UIcon
          name="i-lucide-folder-search"
          class="mx-auto size-8 text-dimmed"
          aria-hidden="true"
        />
        <h2 class="mt-4 font-semibold text-highlighted">
          No projects found
        </h2>
        <p class="mt-2 text-sm text-muted">
          Try a different project name or clear your search.
        </p>
        <UButton
          label="Clear search"
          color="neutral"
          variant="ghost"
          class="mt-3"
          @click="searchQuery = ''"
        />
      </div>
    </section>

    <UModal
      v-model:open="isCreateModalOpen"
      :title="isEditingProject ? 'Edit project' : 'New project'"
      :description="isEditingProject ? 'Update the project details and dates.' : 'Add project details and choose dates from the calendars.'"
      class="w-[calc(100%-2rem)] max-w-4xl"
      scrollable
    >
      <template #body>
        <form
          id="create-project-form"
          class="space-y-6"
          novalidate
          @submit.prevent="createProject"
        >
          <div>
            <label
              for="project-name"
              class="mb-1.5 block text-sm font-medium text-highlighted"
            >
              Project name <span aria-hidden="true">*</span>
            </label>
            <UInput
              id="project-name"
              v-model="projectForm.name"
              placeholder="e.g. Brand identity refresh"
              autocomplete="off"
              required
              :aria-invalid="shouldShowError('name') && Boolean(errors.name)"
              :aria-describedby="shouldShowError('name') && errors.name ? 'project-name-error' : undefined"
              @blur="touched.name = true"
            />
            <p
              v-if="shouldShowError('name') && errors.name"
              id="project-name-error"
              class="mt-1.5 text-sm text-error"
              role="alert"
            >
              {{ errors.name }}
            </p>
          </div>

          <div>
            <label
              for="project-description"
              class="mb-1.5 block text-sm font-medium text-highlighted"
            >
              Description <span class="text-muted">(optional)</span>
            </label>
            <UTextarea
              id="project-description"
              v-model="projectForm.description"
              placeholder="What is this project about?"
              :rows="3"
            />
          </div>

          <div class="grid gap-6 lg:grid-cols-2">
            <div
              role="group"
              aria-labelledby="project-start-date-label"
              :aria-describedby="shouldShowError('startDate') && errors.startDate ? 'project-start-date-error' : undefined"
              :aria-invalid="shouldShowError('startDate') && Boolean(errors.startDate)"
              class="min-w-0"
            >
              <div class="flex items-center justify-between gap-3">
                <p
                  id="project-start-date-label"
                  class="text-sm font-medium text-highlighted"
                >
                  Start date <span aria-hidden="true">*</span>
                </p>
                <span class="text-xs text-muted">DD/MM/YYYY</span>
              </div>
              <UPopover
                v-model:open="isStartDatePickerOpen"
                :content="{ align: 'center', side: 'bottom', sideOffset: 8, collisionPadding: 12 }"
                :ui="{ content: 'z-[60] w-[calc(100vw-2rem)] max-w-80 p-2' }"
                :modal="false"
                dismissible
              >
                <UButton
                  type="button"
                  color="neutral"
                  variant="outline"
                  class="mt-2 flex w-full items-center justify-start gap-2"
                  aria-haspopup="dialog"
                  :aria-expanded="isStartDatePickerOpen"
                  aria-controls="project-start-calendar"
                  :aria-invalid="shouldShowError('startDate') && Boolean(errors.startDate)"
                  :aria-describedby="shouldShowError('startDate') && errors.startDate ? 'project-start-date-error' : undefined"
                >
                  <UIcon
                    name="i-lucide-calendar-days"
                    class="size-4 text-muted"
                    aria-hidden="true"
                  />
                  <span class="flex-1 text-left">
                    {{ projectForm.startDate ? formatDate(projectForm.startDate) : 'DD/MM/YYYY' }}
                  </span>
                </UButton>
                <template #content>
                  <div
                    id="project-start-calendar"
                    role="group"
                    aria-label="Project start date calendar"
                  >
                    <UCalendar
                      v-model="startDateCalendarValue"
                      locale="en-GB"
                      aria-label="Choose project start date"
                      class="w-full"
                      @focusin="touched.startDate = true"
                    />
                  </div>
                </template>
              </UPopover>
              <p
                v-if="shouldShowError('startDate') && errors.startDate"
                id="project-start-date-error"
                class="mt-2 text-sm text-error"
                role="alert"
              >
                {{ errors.startDate }}
              </p>
            </div>

            <div
              role="group"
              aria-labelledby="project-end-date-label"
              :aria-describedby="shouldShowError('endDate') && errors.endDate ? 'project-end-date-error' : undefined"
              :aria-invalid="shouldShowError('endDate') && Boolean(errors.endDate)"
              class="min-w-0"
            >
              <div class="flex items-center justify-between gap-3">
                <p
                  id="project-end-date-label"
                  class="text-sm font-medium text-highlighted"
                >
                  End date <span aria-hidden="true">*</span>
                </p>
                <span class="text-xs text-muted">DD/MM/YYYY</span>
              </div>
              <UPopover
                v-model:open="isEndDatePickerOpen"
                :content="{ align: 'center', side: 'bottom', sideOffset: 8, collisionPadding: 12 }"
                :ui="{ content: 'z-[60] w-[calc(100vw-2rem)] max-w-80 p-2' }"
                :modal="false"
                dismissible
              >
                <UButton
                  type="button"
                  color="neutral"
                  variant="outline"
                  class="mt-2 flex w-full items-center justify-start gap-2"
                  aria-haspopup="dialog"
                  :aria-expanded="isEndDatePickerOpen"
                  aria-controls="project-end-calendar"
                  :aria-invalid="shouldShowError('endDate') && Boolean(errors.endDate)"
                  :aria-describedby="shouldShowError('endDate') && errors.endDate ? 'project-end-date-error' : undefined"
                >
                  <UIcon
                    name="i-lucide-calendar-days"
                    class="size-4 text-muted"
                    aria-hidden="true"
                  />
                  <span class="flex-1 text-left">
                    {{ projectForm.endDate ? formatDate(projectForm.endDate) : 'DD/MM/YYYY' }}
                  </span>
                </UButton>
                <template #content>
                  <div
                    id="project-end-calendar"
                    role="group"
                    aria-label="Project end date calendar"
                  >
                    <UCalendar
                      v-model="endDateCalendarValue"
                      :min-value="startDateCalendarValue"
                      locale="en-GB"
                      aria-label="Choose project end date"
                      class="w-full"
                      @focusin="touched.endDate = true"
                    />
                  </div>
                </template>
              </UPopover>
              <p
                v-if="shouldShowError('endDate') && errors.endDate"
                id="project-end-date-error"
                class="mt-2 text-sm text-error"
                role="alert"
              >
                {{ errors.endDate }}
              </p>
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
            :disabled="isSubmitting"
            @click="cancelCreateProject"
          />
          <UButton
            :label="isEditingProject ? 'Save changes' : 'Create project'"
            type="submit"
            form="create-project-form"
            color="primary"
            :disabled="!isFormValid || isSubmitting"
            :loading="isSubmitting"
          />
        </div>
      </template>
    </UModal>

    <UModal
      v-model:open="isDeleteConfirmationOpen"
      title="Delete project?"
      description="This action will remove the project from your list."
      class="w-[calc(100%-2rem)] max-w-md"
    >
      <template #body>
        <p class="text-sm text-muted">
          Are you sure you want to delete <span class="font-semibold text-highlighted">{{ projectToDelete?.name }}</span>?
        </p>
      </template>

      <template #footer>
        <div class="flex w-full justify-end gap-3">
          <UButton
            label="Cancel"
            color="neutral"
            variant="ghost"
            @click="cancelDeleteProject"
          />
          <UButton
            label="Delete project"
            color="error"
            icon="i-lucide-trash-2"
            :disabled="!projectToDelete"
            @click="confirmDeleteProject"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
