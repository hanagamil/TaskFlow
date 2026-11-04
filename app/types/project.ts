export type ProjectStatus = 'In progress' | 'In review' | 'Planning'

export interface Project {
  id: number
  name: string
  description: string
  status: ProjectStatus
  startDate: string
  endDate: string
}
