export type TaskStatus = 'To Do' | 'In Progress' | 'Done'

export interface Task {
  id: number
  name: string
  description: string
  projectId: number
  dueDate: string
  status: TaskStatus
}
