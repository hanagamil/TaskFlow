import type { Project } from '~/types/project'
import type { Task } from '~/types/task'

export function useTaskFlowData() {
  const projects = useState<Project[]>('taskflow-projects', () => [
    {
      id: 1,
      name: 'Brand identity refresh',
      description: 'A refreshed visual identity and brand system for a growing local business.',
      status: 'In progress',
      startDate: '2026-08-15',
      endDate: '2026-11-20'
    },
    {
      id: 2,
      name: 'Client portal redesign',
      description: 'A clearer, more useful client portal experience across desktop and mobile.',
      status: 'In review',
      startDate: '2026-09-01',
      endDate: '2026-12-05'
    },
    {
      id: 3,
      name: 'Q4 marketing site',
      description: 'A campaign website to introduce the upcoming product release.',
      status: 'Planning',
      startDate: '2026-10-20',
      endDate: '2026-12-18'
    }
  ])

  const tasks = useState<Task[]>('taskflow-tasks', () => [
    {
      id: 1,
      name: 'Prepare project brief',
      description: 'Gather requirements and outline the project goals.',
      projectId: 1,
      dueDate: '2026-11-02',
      status: 'To Do'
    },
    {
      id: 2,
      name: 'Review launch checklist',
      description: 'Confirm the remaining items before the campaign goes live.',
      projectId: 3,
      dueDate: '2026-11-05',
      status: 'To Do'
    },
    {
      id: 3,
      name: 'Design dashboard wireframes',
      description: 'Map the main screens for the client portal experience.',
      projectId: 2,
      dueDate: '2026-10-30',
      status: 'In Progress'
    },
    {
      id: 4,
      name: 'Create brand color palette',
      description: 'Explore a flexible palette for digital and print use.',
      projectId: 1,
      dueDate: '2026-11-01',
      status: 'In Progress'
    },
    {
      id: 5,
      name: 'Collect client feedback',
      description: 'Summarize notes from the latest design review.',
      projectId: 2,
      dueDate: '2026-10-26',
      status: 'Done'
    },
    {
      id: 6,
      name: 'Draft homepage copy',
      description: 'Prepare first-pass copy for the campaign homepage.',
      projectId: 3,
      dueDate: '2026-10-24',
      status: 'Done'
    }
  ])

  return {
    projects,
    tasks
  }
}
