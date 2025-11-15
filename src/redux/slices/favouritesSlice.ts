import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FavouritesState } from '../../types';

const initialState: FavouritesState = {
  favouriteIds: [],
};

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    toggleFavourite: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const index = state.favouriteIds.indexOf(id);
      
      if (index > -1) {
        state.favouriteIds.splice(index, 1);
      } else {
        state.favouriteIds.push(id);
      }
    },
    setFavourites: (state, action: PayloadAction<number[]>) => {
      state.favouriteIds = action.payload;
    },
    clearFavourites: (state) => {
      state.favouriteIds = [];
    },
  },
});

export const { toggleFavourite, setFavourites, clearFavourites } = favouritesSlice.actions;
export default favouritesSlice.reducer;
