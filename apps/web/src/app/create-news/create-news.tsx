import './create-news.module.less';
import React, { ChangeEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNewsAction } from '../store/actions';

/* eslint-disable-next-line */
export interface CreateNewsProps { }
export interface CreateNewsState {
    title: string,
    description: string,
}

export default function CreateNews() {
    const [state, setState] = useState({ title: '', description: '' });

    const dispatch = useDispatch();

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setState(prevState => ({ ...prevState, [event.target.name]: event.target.value }));
    }

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        console.log('news: ', state);
        fetch('http://localhost:3001/api/news', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(state),
        })
            .then(response => response.json())
            .then(data => {
                alert(state.title + ' успешно создана!');
                setState({
                    title: '',
                    description: ''
                });

                dispatch(addNewsAction(data));
            })
            .catch((error) => {
                alert('Ошибка :-(');
            });
    }


    return (
        <form onSubmit={handleSubmit}>
            <h1>Создание новости</h1>
            <p>
                <label>
                    <legend>Заголовок</legend>
                    <input required name="title" type="text" value={state.title} onChange={handleChange} />
                </label>
            </p>
            <p>
                <label>
                    <legend>Текст</legend>
                    <textarea required name="description" value={state.description} onChange={handleChange} />
                </label>
            </p>
            <input type="submit" value="Добавить" />
        </form>
    );
}
