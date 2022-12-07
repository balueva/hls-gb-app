import { NEWS_ADD, NEWS_INIT } from './actions';

const initialSate = {
    news: [],
    eTag: ''
};

export function newsReducer(state = initialSate, action) {

    switch (action?.type) {
        case NEWS_INIT: {
            return { ...state, news: [...action.payload.news], eTag: action.payload.eTag }
        }

        case NEWS_ADD: {
            return { ...state, news: [...state.news, action.payload] }
        }

        default:
            return state
    }
}