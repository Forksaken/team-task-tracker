import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { TaskForm } from '../components/TaskForm';
import { useDeleteTaskMutation, useGetTaskQuery, useUpdateTaskMutation } from '../store/tasksApi';
import { NotFoundPage } from './NotFoundPage';

export default function TaskPage() {
  const { taskId = '' } = useParams();
  const navigate = useNavigate();
  const { currentData: task, isLoading, isFetching, error, refetch } = useGetTaskQuery(taskId);
  const [updateTask, { isLoading: isSaving }] = useUpdateTaskMutation();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();
  const [deleteError, setDeleteError] = useState('');
  async function handleDelete() {
    if (!task) return;
    setDeleteError('');
    try {
      await deleteTask(task.id).unwrap();
      navigate(`/users/${task.userId}/tasks`);
    } catch {
      setDeleteError('Не удалось удалить задачу. Повторите попытку.');
    }
  }
  if (error && 'status' in error && error.status === 404) return <NotFoundPage message="Задача не найдена" />;
  return <section>
    <div className="heading"><h1>Карточка задачи</h1><button className="outline" disabled={isFetching || isSaving || isDeleting} onClick={() => void refetch()}>Обновить</button></div>
    {(isLoading || (isFetching && !task)) && <p role="status">Загружаем задачу…</p>}
    {isFetching && task && <p role="status">Обновляем задачу…</p>}
    {error && <div className="notice" role="alert"><p>Не удалось загрузить задачу.</p><button disabled={isFetching} onClick={() => void refetch()}>Повторить</button></div>}
    {task && <>
      <Link to={`/users/${task.userId}/tasks`}>← К задачам участника</Link>
      <div className="card editor"><h2>{task.title}</h2>
        <TaskForm key={task.id} initialTitle={task.title} initialStatus={task.status} pending={isSaving || isDeleting} submitLabel="Сохранить" onSave={async (title, status) => {
          await updateTask({ id: task.id, title, status }).unwrap();
        }} />
        <button className="danger" disabled={isSaving || isDeleting} onClick={() => void handleDelete()}>{isDeleting ? 'Удаляем…' : 'Удалить задачу'}</button>
        {deleteError && <p className="error" role="alert">{deleteError}</p>}
      </div>
    </>}
  </section>;
}
