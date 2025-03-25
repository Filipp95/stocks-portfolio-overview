import { configureStore } from "@reduxjs/toolkit";
import WsMiddleware from './WsMiddleware';
import portfolioReducer from './portfolioSlice'

const store = configureStore({
  reducer: {
    portfolio: portfolioReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(WsMiddleware)
})

window.store = store;

export default store