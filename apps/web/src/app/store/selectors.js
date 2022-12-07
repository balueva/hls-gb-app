export const getNewsFromReducer = (state) => state.newsReducer;

export const getNews = (state) => getNewsFromReducer(state).news;
export const getETag = (state) => getNewsFromReducer(state).eTag;