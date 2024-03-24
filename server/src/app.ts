import 'express-async-errors'

import express from 'express'

import router from './routes'
import swaggerUi from 'swagger-ui-express';
import errorMiddleware from './middleware/errors'
const app = express()
import swaggerDocs from './swagger.json';

app.use(express.json())
app.use(router)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.use(errorMiddleware)

export default app
