import React from 'react'
import {render} from '../test-utils.js'
import AuthorPage from '../features/authorPage/AuthorPage.js'

it('should display Author name', async () => {
    render(
        <AuthorPage />
    )
})
