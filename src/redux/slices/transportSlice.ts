import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TransportState, TransportItem } from '../../types';

const initialState: TransportState = {
  items: [],
  isLoading: false,
  error: null,
};

const transportSlice = createSlice({
  name: 'transport',
  initialState,
  reducers: {
    fetchTransportStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchTransportSuccess: (state, action: PayloadAction<TransportItem[]>) => {
      state.isLoading = false;
      state.items = action.payload;
      state.error = null;
    },
    fetchTransportFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchTransportStart, fetchTransportSuccess, fetchTransportFailure } = transportSlice.actions;
export default transportSlice.reducer;
