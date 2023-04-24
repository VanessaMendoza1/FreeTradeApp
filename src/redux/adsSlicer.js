import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  ImageData: [],
  VideoData: [],
};

export const adsSlicer = createSlice({
  name: 'ads',
  initialState,
  reducers: {
    AddImageAds: (state, action) => {
      state.ImageData = action.payload;
    },
    AddVideoAds: (state, action) => {
      state.VideoData = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {AddVideoAds, AddImageAds} = adsSlicer.actions;

export default adsSlicer.reducer;
