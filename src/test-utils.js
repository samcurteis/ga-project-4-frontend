import React from 'react'
import {render, waitFor} from '@testing-library/react'
import {BrowserRouter} from 'react-router-dom'
import { Provider } from 'react-redux';
import { setupStore } from './app/store.js'

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = setupStore(preloadedState),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
        <Provider store={store}>
        <BrowserRouter>
        {children}
        </BrowserRouter>
        </Provider>
    )
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}

export * from '@testing-library/react'

export {renderWithProviders as render}

export const waitForNeverToHappen = async (callable) => {
    await expect(waitFor(callable)).rejects.toEqual(expect.anything())
}
