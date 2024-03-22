import * as app from 'express';
import router from './routes';
const server = app();
server.use(router);

export default server.listen(3003);
