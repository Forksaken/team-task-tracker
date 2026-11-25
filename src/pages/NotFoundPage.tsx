import { Link } from 'react-router';
export function NotFoundPage({ message = 'Страница не найдена' }: { message?: string }) {
  return <section className="card"><h1>404 — {message}</h1><p>Проверьте адрес или вернитесь к команде.</p><Link to="/users">Все участники</Link></section>;
}
