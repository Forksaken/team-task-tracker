import { configureStore } from '@reduxjs/toolkit';
import users from './usersSlice';
import ui from './uiSlice';
import { usersMiddleware } from './usersMiddleware';
import { tasksApi } from './tasksApi';

export const store = configureStore({
  reducer: { users, ui, [tasksApi.reducerPath]: tasksApi.reducer },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(usersMiddleware, tasksApi.middleware),
});
let previousFavorites = store.getState().ui.favoriteUserIds;
store.subscribe(() => {
  const ids = store.getState().ui.favoriteUserIds;
  if (ids === previousFavorites) return;
  previousFavorites = ids;
  try {
    localStorage.setItem('favoriteUserIds', JSON.stringify(ids));
  } catch {
    // При недоступном localStorage избранное остаётся в текущей сессии.
  }
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
