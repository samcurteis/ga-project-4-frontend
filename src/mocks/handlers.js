import { rest } from 'msw'
import { API } from 'lib/api.js'

export const handlers = [ 
    rest.get(`${process.env.REACT_APP_BASE_URL}/api/authors/`, (req, res, ctx) => {
    return res(
        ctx.status(200),
        ctx.json({
            name: 'Poet',
            poems: [{
                title: 'Poem title',
                content: 'Poem content',
                author: [1],
                poem_favorites: [1],
                poem_likes: [1]
            }],
            likes: [1],
            favorites: [1]
        })
    })
]
