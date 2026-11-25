import { useState, type FormEvent } from 'react';
import { statusLabels, type TaskStatus } from '../types';

interface Props {
  initialTitle?: string;
  initialStatus?: TaskStatus;
  pending: boolean;
  submitLabel: string;
  onSave: (title: string, status: TaskStatus) => Promise<void>;
  clearOnSuccess?: boolean;
}
export function TaskForm({ initialTitle = '', initialStatus = 'todo', pending, submitLabel, onSave, clearOnSuccess = false }: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [status, setStatus] = useState(initialStatus);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage('');
    if (!title.trim()) {
      setError('Введите название задачи');
      return;
    }
    setError('');
    try {
      await onSave(title.trim(), status);
      setMessage(clearOnSuccess ? 'Задача создана' : 'Задача сохранена');
      if (clearOnSuccess) { setTitle(''); setStatus('todo'); }
    } catch {
      setError('Не удалось сохранить задачу. Проверьте подключение к API и повторите сохранение.');
    }
  }
  return <form onSubmit={handleSubmit} noValidate>
    <fieldset disabled={pending}>
      <label>Название задачи<input value={title} onChange={event => setTitle(event.target.value)} required /></label>
      <label>Статус задачи<select value={status} onChange={event => setStatus(event.target.value as TaskStatus)}>
        {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select></label>
      <button type="submit">{pending ? 'Сохраняем…' : submitLabel}</button>
    </fieldset>
    {error && <p className="error" role="alert">{error}</p>}
    {message && <p className="success" role="status">{message}</p>}
  </form>;
}
