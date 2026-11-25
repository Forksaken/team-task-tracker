import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { selectUsers } from './usersSlice';

function readFavorites(): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem('favoriteUserIds') ?? '[]');
    return Array.isArray(value) ? [...new Set(value.filter((id): id is string => typeof id === 'string'))] : [];
  } catch {
    return [];
  }
}
const uiSlice = createSlice({
  name: 'ui', initialState: { favoriteUserIds: readFavorites() },
  reducers: {
    toggleFavorite(state, { payload: id }: PayloadAction<string>) {
      state.favoriteUserIds = state.favoriteUserIds.includes(id)
        ? state.favoriteUserIds.filter(value => value !== id)
        : [...state.favoriteUserIds, id];
    },
  },
});
export const { toggleFavorite } = uiSlice.actions;
export const selectFavoriteUserIds = (state: RootState) => state.ui.favoriteUserIds;
export const selectFavoriteCount = (state: RootState) => selectFavoriteUserIds(state).length;
export const selectFavoriteUsers = createSelector([selectUsers, selectFavoriteUserIds],
  (users, ids) => users.filter(user => ids.includes(user.id)));
export default uiSlice.reducer;
