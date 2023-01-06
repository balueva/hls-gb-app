import { configureStore } from '@reduxjs/toolkit'
import { newsReducer } from './newsReducer';

const reducer = {
    newsReducer: newsReducer
};

export const store = configureStore({
    reducer,
    devTools: process.env.NODE_ENV !== 'production'
});