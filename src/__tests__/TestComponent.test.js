import React from 'react'
import {render, screen} from '../test-utils.js'
import '@testing-library/jest-dom'
import TestComponent from '../components/TestComponent.js'
import {server} from '../mocks/server.js'

it('should display Author name', async () => {
    server.listen()
    render(
        <TestComponent />
    )

    const authorName = await screen.findByText('Poet')
    expect(authorName).toBeInTheDocument()
})
