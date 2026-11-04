import type { Project, ProjectStatus } from '~/types/project'
import { useTaskFlowData } from '~/composables/useTaskFlowData'
import type { Task } from '~/types/task'

export type ProjectInput = Omit<Project, 'id'>

export type ProjectOperationResult<T, Reason extends string = never>
  = | { success: true, data: T }
    | (Reason extends string ? { success: false, reason: Reason } : never)

export type DeleteProjectResult = ProjectOperationResult<
  { project: Project, deletedTaskCount: number },
  'not-found'
>

function isProjectStatus(status: string): status is ProjectStatus {
  return status === 'Planning' || status === 'In progress' || status === 'In review'
}

function isValidDate(date: string): boolean {
  const dateParts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)

  if (!dateParts) {
    return false
  }

  const year = Number(dateParts[1])
  const month = Number(dateParts[2])
  const day = Number(dateParts[3])
  const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
  const daysInMonth = [
    31,
    isLeapYear ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31
  ]

  return month >= 1
    && month <= 12
    && day >= 1
    && day <= (daysInMonth[month - 1] ?? 0)
}

function isValidProjectInput(input: ProjectInput): boolean {
  return input.name.trim().length > 0
    && isProjectStatus(input.status)
    && isValidDate(input.startDate)
    && isValidDate(input.endDate)
    && input.endDate >= input.startDate
}

export function useProjects() {
  const { projects, tasks } = useTaskFlowData()

  function getProjectById(id: number): Project | undefined {
    return projects.value.find(project => project.id === id)
  }

  function createProject(input: ProjectInput): ProjectOperationResult<Project, 'invalid-input'> {
    if (!isValidProjectInput(input)) {
      return { success: false, reason: 'invalid-input' }
    }

    const project: Project = {
      id: Math.max(0, ...projects.value.map(existingProject => existingProject.id)) + 1,
      name: input.name.trim(),
      description: input.description.trim(),
      status: input.status,
      startDate: input.startDate,
      endDate: input.endDate
    }

    projects.value.unshift(project)

    return { success: true, data: project }
  }

  function updateProject(
    id: number,
    input: ProjectInput
  ): ProjectOperationResult<Project, 'not-found' | 'invalid-input'> {
    const project = getProjectById(id)

    if (!project) {
      return { success: false, reason: 'not-found' }
    }

    if (!isValidProjectInput(input)) {
      return { success: false, reason: 'invalid-input' }
    }

    Object.assign(project, {
      name: input.name.trim(),
      description: input.description.trim(),
      status: input.status,
      startDate: input.startDate,
      endDate: input.endDate
    })

    return { success: true, data: project }
  }

  function deleteProject(id: number): DeleteProjectResult {
    const project = getProjectById(id)

    if (!project) {
      return { success: false, reason: 'not-found' }
    }

    const deletedTaskCount = tasks.value.filter((task: Task) => task.projectId === id).length
    projects.value = projects.value.filter(currentProject => currentProject.id !== id)
    tasks.value = tasks.value.filter(task => task.projectId !== id)

    return {
      success: true,
      data: { project, deletedTaskCount }
    }
  }

  return {
    projects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
  }
}
