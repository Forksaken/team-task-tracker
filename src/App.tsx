import { lazy, Suspense } from 'react';
import { Navigate, NavLink, Route, Routes } from 'react-router';
import { useAppSelector } from './store/hooks';
import { selectFavoriteCount } from './store/uiSlice';
import { UsersPage } from './pages/UsersPage';
import { UserLayout, UserProfilePage } from './pages/UserLayout';
import { UserTasksPage } from './pages/UserTasksPage';
import { NotFoundPage } from './pages/NotFoundPage';

const TaskPage = lazy(() => import('./pages/TaskPage'));
export default function App() {
  const count = useAppSelector(selectFavoriteCount);
  return <div className="page">
    <header><NavLink className="brand" to="/users">team-task-tracker</NavLink>
      <nav aria-label="Основная навигация"><NavLink to="/users">Участники</NavLink><NavLink to="/favorites">Избранное: {count}</NavLink></nav>
    </header>
    <main><Suspense fallback={<p role="status">Загружаем страницу…</p>}>
      <Routes>
        <Route path="/" element={<Navigate to="/users" replace />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/:userId" element={<UserLayout />}>
          <Route index element={<UserProfilePage />} />
          <Route path="tasks" element={<UserTasksPage />} />
        </Route>
        <Route path="/tasks/:taskId" element={<TaskPage />} />
        <Route path="/favorites" element={<UsersPage favorites />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense></main>
  </div>;
}
