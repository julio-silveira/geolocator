import 'express-async-errors'

import express from 'express'
import router from './routes'
import errorMiddleware from './middleware/errors'
const app = express()

app.use(express.json())
app.use(router)

app.use(errorMiddleware)

export default app
