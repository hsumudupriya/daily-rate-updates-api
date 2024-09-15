import express from 'express';
import ratesRouter from './routes/rates';

const app = express();

app.use(express.json());
app.use(ratesRouter);

const port = 3000;

app.listen(port, () => {
    console.log(`Server listening on port ${port}....`);
});
