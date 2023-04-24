import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  subdata: [],
};

export const subSlicer = createSlice({
  name: 'sub',
  initialState,
  reducers: {
    SubDataAdd: (state, action) => {
      state.subdata = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {SubDataAdd} = subSlicer.actions;

export default subSlicer.reducer;
