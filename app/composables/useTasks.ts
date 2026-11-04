import type { ProjectOperationResult } from '~/composables/useProjects'
import { useTaskFlowData } from '~/composables/useTaskFlowData'
import type { Project } from '~/types/project'
import type { Task, TaskStatus } from '~/types/task'

export type TaskInput = Omit<Task, 'id'>

function isTaskStatus(status: string): status is TaskStatus {
  return status === 'To Do' || status === 'In Progress' || status === 'Done'
}

function isValidDueDate(date: string): boolean {
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

function isValidTaskInput(input: TaskInput): boolean {
  return input.name.trim().length > 0
    && isValidDueDate(input.dueDate)
    && isTaskStatus(input.status)
}

export function useTasks() {
  const { tasks, projects } = useTaskFlowData()

  function getTaskById(id: number): Task | undefined {
    return tasks.value.find(task => task.id === id)
  }

  function hasProject(projectId: number): boolean {
    return projects.value.some((project: Project) => project.id === projectId)
  }

  function createTask(
    input: TaskInput
  ): ProjectOperationResult<Task, 'invalid-input' | 'invalid-project'> {
    if (!isValidTaskInput(input)) {
      return { success: false, reason: 'invalid-input' }
    }

    if (!hasProject(input.projectId)) {
      return { success: false, reason: 'invalid-project' }
    }

    const task: Task = {
      id: Math.max(0, ...tasks.value.map(existingTask => existingTask.id)) + 1,
      name: input.name.trim(),
      description: input.description.trim(),
      projectId: input.projectId,
      dueDate: input.dueDate,
      status: input.status
    }

    tasks.value.unshift(task)

    return { success: true, data: task }
  }

  function updateTask(
    id: number,
    input: TaskInput
  ): ProjectOperationResult<Task, 'not-found' | 'invalid-input' | 'invalid-project'> {
    const task = getTaskById(id)

    if (!task) {
      return { success: false, reason: 'not-found' }
    }

    if (!isValidTaskInput(input)) {
      return { success: false, reason: 'invalid-input' }
    }

    if (!hasProject(input.projectId)) {
      return { success: false, reason: 'invalid-project' }
    }

    Object.assign(task, {
      name: input.name.trim(),
      description: input.description.trim(),
      projectId: input.projectId,
      dueDate: input.dueDate,
      status: input.status
    })

    return { success: true, data: task }
  }

  function deleteTask(id: number): ProjectOperationResult<{ task: Task }, 'not-found'> {
    const task = getTaskById(id)

    if (!task) {
      return { success: false, reason: 'not-found' }
    }

    tasks.value = tasks.value.filter(currentTask => currentTask.id !== id)

    return {
      success: true,
      data: { task }
    }
  }

  function updateTaskStatus(
    id: number,
    status: string
  ): ProjectOperationResult<Task, 'not-found' | 'invalid-status'> {
    const task = getTaskById(id)

    if (!task) {
      return { success: false, reason: 'not-found' }
    }

    if (!isTaskStatus(status)) {
      return { success: false, reason: 'invalid-status' }
    }

    task.status = status

    return { success: true, data: task }
  }

  return {
    tasks,
    projects,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus
  }
}
