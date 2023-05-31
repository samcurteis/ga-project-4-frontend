import React from 'react'
import {render, screen, waitForNeverToHappen} from '../test-utils.js'
import '@testing-library/jest-dom'
import AuthorPage from '../features/authorPage/AuthorPage.js'
import "../setupTests"
import {AUTH} from '../lib/auth.js'

it('should display Author name and poem title', async () => {
    render(
        <AuthorPage />
    )

    const authorName = await screen.findByText('Poet')
    const poem = await screen.findByText('Poem title')
    expect(authorName).toBeInTheDocument()
    expect(poem).toBeInTheDocument()
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
})
