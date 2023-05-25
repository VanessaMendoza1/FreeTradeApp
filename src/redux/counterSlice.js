import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  value: 0,
  data: [],
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: state => {
      state.value += 1;
    },

    DataInsert: (state, action) => {
      state.data = action?.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {increment, decrement, DataInsert} = counterSlice?.actions;

export default counterSlice.reducer;
