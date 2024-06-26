import express from 'express';
import bodyParser from 'body-parser';
import tickerRoute from './tickers.js'
import accountRoute from './account.js'
import balanceRoute from './balance.js'
import incomeRoute from './income.js'
import transactionRoute from './transaction.js'
import cors from 'cors';

const app = express();
const PORT = 5000

app.use(bodyParser.json());
app.use(cors({
    Origin: 'http://127.0.0.1'
}));

app.use('/ticker', tickerRoute);
app.use('/account', accountRoute);
app.use('/balance', balanceRoute);
app.use('/income', incomeRoute);
app.use('/transaction', transactionRoute);

app.get('/', async (req, res) =>{
    console.log('My First Get Route');
    res.send('Hello World!');
});

//Endpoints to be added
    //GET /tickers - finds all ticker symbols
    //POST /tickers - creates a ticker symbol
    //GET /tickers/:id -gets a specific ticker symbol
    //DELETE /tickers/:id - deletes a specific ticker symbol
    //PATCH /tickers/:id - updates a specific ticker symbol
//Tutorial: https://www.freecodecamp.org/news/create-crud-api-project/
//Tutorial walks through the same endpoints for users of a different type of use case

app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));





