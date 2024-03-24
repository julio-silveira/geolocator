import 'express-async-errors'

import express from 'express'

import router from './routes'
import swaggerUi from 'swagger-ui-express';
import errorMiddleware from './middleware/errors'
import swaggerDocs from './swagger.json';
import expressWinston from 'express-winston';
import winston from 'winston';
const app = express()

app.use(express.json())
app.use(router)

app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log' })
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  )
}));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.use(errorMiddleware)

export default app
