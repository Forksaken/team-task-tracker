import { Link } from 'react-router';
import { FavoriteButton } from '../components/FavoriteButton';
import { UsersGate } from '../components/UsersGate';
import { useAppSelector } from '../store/hooks';
import { selectUsers } from '../store/usersSlice';
import { selectFavoriteUsers } from '../store/uiSlice';

export function UsersPage({ favorites = false }: { favorites?: boolean }) {
  const users = useAppSelector(favorites ? selectFavoriteUsers : selectUsers);
  return <section>
    <div className="heading"><h1>{favorites ? 'Избранные участники' : 'Участники команды'}</h1><span className="muted">{users.length} участников</span></div>
    <UsersGate>
      {users.length === 0 ? <div className="card"><p>{favorites ? 'Пока никого нет в избранном. Добавьте участников из списка команды.' : 'Участников пока нет.'}</p></div> :
        <div className="grid">{users.map(user => <article className="card" key={user.id}>
          <h2><Link to={`/users/${user.id}`}>{user.name}</Link></h2>
          <p className="muted">{user.email}</p>
          <div className="row"><FavoriteButton userId={user.id} /><Link to={`/users/${user.id}/tasks`}>Задачи →</Link></div>
        </article>)}</div>}
    </UsersGate>
  </section>;
}
