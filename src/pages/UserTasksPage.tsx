import { Link, useOutletContext, useSearchParams } from 'react-router';
import { TaskForm } from '../components/TaskForm';
import { useAddTaskMutation, useGetTasksQuery } from '../store/tasksApi';
import { isTaskStatus, statusLabels, type User } from '../types';

export function UserTasksPage() {
  const user = useOutletContext<User>();
  const [searchParams, setSearchParams] = useSearchParams();
  const rawStatus = searchParams.get('status');
  const status = isTaskStatus(rawStatus) ? rawStatus : undefined;
  const { currentData, isLoading, isFetching, isError, isSuccess, refetch } = useGetTasksQuery({ userId: user.id, status });
  const [addTask, { isLoading: isAdding }] = useAddTaskMutation();
  return <div className="task-columns">
    <section>
      <div className="heading"><h2>Задачи</h2><button className="outline" disabled={isFetching} onClick={() => void refetch()}>Обновить</button></div>
      <label className="filter">Фильтр статуса<select value={status ?? ''} onChange={event => {
        const next = new URLSearchParams(searchParams);
        if (event.target.value) next.set('status', event.target.value); else next.delete('status');
        setSearchParams(next);
      }}>
        <option value="">Все статусы</option>
        {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select></label>
      {rawStatus && !status && <p className="muted">Неизвестный фильтр. Показаны все статусы.</p>}
      {(isLoading || (isFetching && !currentData)) && <p role="status">Загружаем задачи…</p>}
      {isFetching && currentData && <p role="status">Обновляем задачи…</p>}
      {isError && <div className="notice" role="alert"><p>Не удалось загрузить задачи.</p><button disabled={isFetching} onClick={() => void refetch()}>Повторить</button></div>}
      {isSuccess && !isFetching && <p className="muted" role="status">Загружено задач: {currentData?.length ?? 0}</p>}
      {currentData && <div className="task-list">
        {currentData.length === 0 ? <div className="card">Задач с таким статусом пока нет. Создайте новую задачу или выберите другой фильтр.</div> : currentData.map(task =>
          <article className="card task" key={task.id}><Link to={`/tasks/${task.id}`}>{task.title}</Link><span className={`badge ${task.status}`}>{statusLabels[task.status]}</span></article>)}
      </div>}
    </section>
    <section className="card new-task"><h2>Новая задача</h2>
      <TaskForm pending={isAdding} submitLabel="Создать задачу" clearOnSuccess onSave={async (title, taskStatus) => {
        await addTask({ userId: user.id, title, status: taskStatus }).unwrap();
      }} />
    </section>
  </div>;
}
