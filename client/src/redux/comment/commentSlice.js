import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  currentComment: null,
  loading: false,
  commentError: null,
}

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    addCommentStart: (state) => {
      state.loading = true
      state.commentError = null
    },
    addCommentSuccess: (state, action) => {
      state.loading = false
      state.commentError = null
      state.currentComment = action.payload
    },
    addCommentFailure: (state, action) => {
      state.loading = false
      state.commentError = action.payload.commentError
    },
    updateCommentStart: (state) => {
      state.loading = true
      state.commentError = null
    },
    updateCommentSuccess: (state, action) => {
      state.loading = false
      state.commentError = null
      state.currentComment = action.payload
    },
    updateCommentFailure: (state, action) => {
      state.loading = false
      state.commentError = action.payload
    },
    deleteCommentStart: (state) => {
      state.loading = true
      state.commentError = null
    },
    deleteCommentSuccess: (state) => {
      state.loading = false
      state.commentError = null
      state.currentComment = null
    },
    deleteCommentFailure: (state, action) => {
      state.loading = false
      state.commentError = action.payload
    },
  },
})

export const {
  addCommentStart,
  addCommentSuccess,
  addCommentFailure,
  updateCommentStart,
  updateCommentSuccess,
  updateCommentFailure,
  deleteCommentStart,
  deleteCommentSuccess,
  deleteCommentFailure,
} = commentSlice.actions

export default commentSlice.reducer
