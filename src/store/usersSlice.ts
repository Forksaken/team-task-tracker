import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../types';
import type { RootState } from './store';

export interface UsersState {
  items: User[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  requestId: string | null;
}
const initialState: UsersState = { items: [], status: 'idle', error: null, requestId: null };
const usersSlice = createSlice({
  name: 'users', initialState,
  reducers: {
    usersRequested() {},
    usersLoading(state, { payload }: PayloadAction<string>) {
      state.status = 'loading';
      state.error = null;
      state.requestId = payload;
    },
    usersLoaded(state, { payload }: PayloadAction<{ requestId: string; items: User[] }>) {
      if (state.requestId !== payload.requestId) return;
      state.items = payload.items;
      state.status = 'succeeded';
    },
    usersFailed(state, { payload }: PayloadAction<{ requestId: string; message: string }>) {
      if (state.requestId !== payload.requestId) return;
      state.error = payload.message;
      state.status = 'failed';
    },
  },
});
export const { usersRequested, usersLoading, usersLoaded, usersFailed } = usersSlice.actions;
export const selectUsers = (state: RootState) => state.users.items;
export const selectUserById = (state: RootState, id: string) => selectUsers(state).find(user => user.id === id);
export default usersSlice.reducer;
