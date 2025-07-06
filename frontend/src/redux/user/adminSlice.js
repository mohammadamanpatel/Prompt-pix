// src/redux/adminSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  imageGenerationData: [], // Initialize as an empty array
  gifGenerationData: [], // Initialize as an empty array
};

const adminSlice = createSlice({
  name: "admindata",
  initialState,
  reducers: {
    addImageGenerationData: (state, action) => {
      // Check if state.imageGenerationData is an array
      if (Array.isArray(state.imageGenerationData)) {
        state.imageGenerationData.push(action.payload);
        console.log(state);
      } else {
        console.error("imageGenerationData is not an array");
      }
    },
    addGifGenerationData: (state, action) => {
      // Check if state.gifGenerationData is an array
      if (Array.isArray(state.gifGenerationData)) {
        state.gifGenerationData.push(action.payload);
      } else {
        console.error("gifGenerationData is not an array");
      }
    },
  },
});

export const { addImageGenerationData, addGifGenerationData } =
  adminSlice.actions;
export default adminSlice.reducer;
