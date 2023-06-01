import React from 'react'
import {render, screen, waitForNeverToHappen} from '../test-utils.js'
import '@testing-library/jest-dom'
import AuthorPage from '../features/authorPage/AuthorPage.js'
import "../setupTests"
import {AUTH} from '../lib/auth.js'
import userEvent from '@testing-library/user-event'
import {server} from '../mocks/server.js'
import { rest } from 'msw'

it('should display Author name and poem title', async () => {
    render(
        <AuthorPage />
    )

    const authorName = await screen.findByText('Poet')
    const poemTitle = await screen.findByText('Poem title')
    expect(authorName).toBeInTheDocument()
    expect(poemTitle).toBeInTheDocument()
})

describe('favorite functionality', () => {
    it('checks that favorite counter shows the correct number when user is logged in', async () => {
    AUTH.getPayload = jest.fn(() => true)
    render(
        <AuthorPage />
    )

   const favorites = await screen.findByText('1 favourite')
    expect(favorites).toBeInTheDocument()
    })

    it("checks that favorite counter doesn't show when user is not logged in", async () => {
    AUTH.getPayload = jest.fn(() => false)
        
    render(
        <AuthorPage />
    )

    await waitForNeverToHappen(() => {
    expect(screen.getByText('1 favourite')).toBeInTheDocument()
    })
    })

    it("increments favorite counter by one when user clicks on favorite button", async () => {
        server.use(
            rest.put(`${process.env.REACT_APP_BASE_URL}/api/authors/:id/`, (req, res, ctx) => {
                return res(
                    ctx.status(200),
                    ctx.json({
                        name: 'Poet',
                        poems: [
                            {
                                id: 1,
                                title: 'Poem title'
                            }
                        ],
                        favorites: [1, 3],
                    })
                )}),
        )

        AUTH.getPayload = jest.fn(() => true)
        const user = userEvent.setup()
        render(
            <AuthorPage />
        )

        const favorites = await screen.findByRole('button', { name: /1 favourite/i })
        await user.click(favorites)
        const updatedFavorites = await screen.findByText('2 favourites')
        await expect(updatedFavorites).toBeInTheDocument()
    })
})
