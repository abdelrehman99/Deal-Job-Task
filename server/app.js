import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import userRouter from './users/index.js';
import adsRouter from './ads/index.js'
import propertiesRouter from './properties/index.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.use('/api/v0/users', userRouter);
app.use('/api/v0/properties', propertiesRouter);
app.use('/api/v0/ads', adsRouter);

export default app;
