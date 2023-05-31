import { rest } from 'msw'

export const handlers = [ 
    rest.get('test-endpoint', (req, res, ctx) => {
    return res(
        ctx.status(200),
        ctx.json({
            name: 'Poet',
        })
    )}),
    rest.get(`${process.env.REACT_APP_BASE_URL}/api/authors/:id`, (req, res, ctx) => {
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
            favorites: [1],
            likes: [1]
        })
    )}),
    rest.get(`${process.env.REACT_APP_BASE_URL}/api/auth/:id/`, (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                id: '1',
                is_staff: true
            })
        )})
]
