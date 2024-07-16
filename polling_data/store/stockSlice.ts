// store/stockSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StockData {
  symbol: string;
  timestamp: string;
  price: string;
}

interface StockState {
  data: StockData[];
  currentStock: string;
}

const initialState: StockState = {
  data: [],
  currentStock: '',
};

const stockSlice = createSlice({
  name: 'bitcoin',
  initialState,
  reducers: {
    setStockData(state, action: PayloadAction<StockData[]>) {
      state.data = action.payload;
    },
    setCurrentStock(state, action: PayloadAction<string>) {
      state.currentStock = action.payload;
    },
  },
});

export const { setStockData, setCurrentStock } = stockSlice.actions;

export default stockSlice.reducer;
