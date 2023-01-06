import './news.module.less';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getETag, getNews } from '../store/selectors';
import { initNewsAction } from '../store/actions';

/* eslint-disable-next-line */
export interface NewsProps { }
export interface PeaceOfNews {
    id: number,
    title: string,
    description: string,
    createdAt: number
}

const sortNews = (news: PeaceOfNews[]) => {
    return news.sort((a, b) => a.createdAt - b.createdAt)
}

export default function News(props: NewsProps) {
    const [news, setNews] = useState([] as PeaceOfNews[]);

    const storeNews = useSelector(getNews);
    const storeETag = useSelector(getETag);
    //console.log('storeNews ', storeNews, storeETag);

    const dispatch = useDispatch();

    useEffect(() => {
        let eTag: string = '';

        fetch('http://localhost:3001/api/news', { headers: { 'If-None-Match': storeETag } })
            .then(response => {
                //console.log('headers = ', response.headers);
                eTag = response.headers.get('etag') || '';

                if (eTag === storeETag)
                    return storeNews
                else
                    return response.json()
            })
            .then(news => {

                if (eTag === storeETag) {
                    console.log('берем из хранилища')
                    setNews(news);
                }
                else {
                    console.time('sorting');
                    const sortedNews = sortNews(news);
                    console.timeEnd('sorting');
                    setNews(sortedNews);

                    dispatch(initNewsAction(news, eTag));
                }
            })
    }, []);

    return (
        <div>
            <h1>Последние новости</h1>
            <ul>
                {news.map(peaceOfNews => {
                    return <li key={peaceOfNews.id}>
                        <h2>{peaceOfNews.title}</h2>
                        <p>{peaceOfNews.description}</p>
                        <hr />
                    </li>
                })}
            </ul>
        </div>
    );
}
