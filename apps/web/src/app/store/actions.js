export const NEWS_INIT = 'NEWS_INIT';
export const NEWS_ADD = 'NEWS_ADD';

export const addNewsAction = (news) => ({
    type: NEWS_ADD,
    payload: news
});

export const initNewsAction = (news, eTag) => ({
    type: NEWS_INIT,
    payload: { news, eTag }
})