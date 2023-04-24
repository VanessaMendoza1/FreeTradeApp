import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  PostData: [],
  TradingData: [],
  SellingData: [],
  ServiceData: [],
};

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    PostAdd: (state, action) => {
      state.PostData = action.payload;
    },
    TradingAdd: (state, action) => {
      state.TradingData = action.payload;
    },
    SellingAdd: (state, action) => {
      state.SellingData = action.payload;
    },
    ServiceAdd: (state, action) => {
      state.ServiceData = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {PostAdd, TradingAdd, SellingAdd, ServiceAdd} = postSlice.actions;

export default postSlice.reducer;
