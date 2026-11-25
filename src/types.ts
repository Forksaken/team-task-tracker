export interface User { id: string; name: string; email: string }
export type TaskStatus = 'todo' | 'doing' | 'done';
export interface Task { id: string; userId: string; title: string; status: TaskStatus }
export const statusLabels: Record<TaskStatus, string> = {
  todo: 'К выполнению', doing: 'В работе', done: 'Готово',
};
export function isTaskStatus(value: string | null): value is TaskStatus {
  return value === 'todo' || value === 'doing' || value === 'done';
}
