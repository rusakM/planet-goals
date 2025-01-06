import Express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = Express();
app.use(cors());

console.log(`App mode ${process.env.APP_MODE}`);
console.log('hello');

app.listen(process.env.PORT, () =>
    console.log(`Server is running on port ${process.env.PORT}`)
);
