import React from 'react'
import {render} from '@testing-library/react'
import {BrowserRouter} from 'react-router-dom'
import { Provider } from 'react-redux';
import store from './app/store.js';

const customRender = ({children}) => {
    return (
        <Provider store={store}>
        <BrowserRouter>
        {children}
        </BrowserRouter>
        </Provider>
    )
}

export * from '@testing-library/react'

export {customRender as render}
