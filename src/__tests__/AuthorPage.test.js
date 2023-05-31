import React from 'react'
import {render, screen} from '../test-utils.js'
import '@testing-library/jest-dom'
import AuthorPage from '../features/authorPage/AuthorPage.js'
import { server } from '../mocks/server.js'

it('should display Author name', async () => {
    server.listen()
    render(
        <AuthorPage />
    )

    const authorName = await screen.findByText('Poet')
    expect(authorName).toBeInTheDocument()
})
