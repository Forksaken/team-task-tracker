import type { Dispatch, Middleware } from '@reduxjs/toolkit';
import { usersRequested, usersLoading, usersLoaded, usersFailed, type UsersState } from './usersSlice';

async function loadUsers(dispatch: Dispatch) {
  const requestId = crypto.randomUUID();
  dispatch(usersLoading(requestId));
  try {
    const response = await fetch('http://localhost:3001/users');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const items = await response.json();
    dispatch(usersLoaded({ requestId, items }));
  } catch (error) {
    dispatch(usersFailed({ requestId, message: `Не удалось загрузить участников. ${error instanceof Error ? error.message : String(error)}` }));
  }
}
export const usersMiddleware: Middleware<object, { users: UsersState }> = api => next => action => {
  const result = next(action);
  if (usersRequested.match(action) && api.getState().users.status !== 'loading') {
    void loadUsers(api.dispatch);
  }
  return result;
};
