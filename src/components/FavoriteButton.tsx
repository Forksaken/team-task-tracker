import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectFavoriteUserIds, toggleFavorite } from '../store/uiSlice';

export function FavoriteButton({ userId }: { userId: string }) {
  const dispatch = useAppDispatch();
  const favorite = useAppSelector(selectFavoriteUserIds).includes(userId);
  return <button className="outline" aria-pressed={favorite} onClick={() => dispatch(toggleFavorite(userId))}>
    {favorite ? 'В избранном' : 'В избранное'}
  </button>;
}
