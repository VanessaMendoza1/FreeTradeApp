import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  MyTradingData: [],
  MySellingData: [],
  MyServiceData: [],
};

export const myPost = createSlice({
  name: 'mypost',
  initialState,
  reducers: {
    MyTradingAdd: (state, action) => {
      state.MyTradingData = action.payload;
    },
    MySellingAdd: (state, action) => {
      state.MySellingData = action.payload;
    },
    MyServiceAdd: (state, action) => {
      state.MyServiceData = action.payload;
    },
  },
});

export const {MyTradingAdd, MySellingAdd, MyServiceAdd} = myPost.actions;

export default myPost.reducer;
