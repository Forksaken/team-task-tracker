import { useEffect, type ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { usersRequested } from '../store/usersSlice';

export function UsersGate({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector(state => state.users);
  useEffect(() => {
    if (status === 'idle') dispatch(usersRequested());
  }, [dispatch, status]);
  if (status === 'idle' || status === 'loading') return <p role="status">Загружаем участников…</p>;
  if (status === 'failed') return <div className="notice" role="alert">
    <p>{error}</p><button onClick={() => dispatch(usersRequested())}>Повторить</button>
  </div>;
  return children;
}
