import { Link, NavLink, Outlet, useOutletContext, useParams } from 'react-router';
import { FavoriteButton } from '../components/FavoriteButton';
import { UsersGate } from '../components/UsersGate';
import { useAppSelector } from '../store/hooks';
import { selectUserById } from '../store/usersSlice';
import type { User } from '../types';
import { NotFoundPage } from './NotFoundPage';

export function UserLayout() {
  const { userId = '' } = useParams();
  const user = useAppSelector(state => selectUserById(state, userId));
  return <UsersGate>{user ? <section>
    <Link to="/users">← Все участники</Link>
    <div className="heading"><h1>{user.name}</h1><FavoriteButton userId={user.id} /></div>
    <nav className="tabs" aria-label="Участник"><NavLink to={`/users/${user.id}`} end>Профиль</NavLink><NavLink to={`/users/${user.id}/tasks`}>Задачи</NavLink></nav>
    <Outlet context={user} key={user.id} />
  </section> : <NotFoundPage message="Участник не найден" />}</UsersGate>;
}
export function UserProfilePage() {
  const user = useOutletContext<User>();
  return <div className="card"><h2>Профиль участника</h2><p>{user.name}</p><a href={`mailto:${user.email}`}>{user.email}</a></div>;
}
