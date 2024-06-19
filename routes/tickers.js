import express from 'express';
//import sql from './node_modules/mssql/index.js'
//import fs from 'fs';

const router = express.Router();
//const dbConfig = JSON.parse(fs.readFileSync('dbConfig.json', 'utf-8'));


// Mock DB to be later be connected to a true DB
let tickers = [
    {
        ticker: 'AAPL',
        ticker_name: 'Apple Computer'
    },
    {
        ticker: 'HD',
        ticker_name: 'The Home Depot'
    },
    {
        ticker: 'O',
        ticker_name: 'Realty Income'
    },
    {
        ticker: 'SCHD',
        ticker_name: 'Schwab High Dividend Yield ETF'
    }
]


router.get('/', async (req, res) => {
    try {
        const db = sql.connect(dbConfig, err => {
            if (err) {
                console.error('Database connection failed:', err);
                return;
            }
            console.log('Connected to the database.')
        });

        const rqst = new sql.Request();
        const rslt = await rqst.query('select * from invest.lkup.tickers');

        const tickers = rslt.recordset.map(row => ({
            ticker: tickers.ticker,
            ticker_name: tickers.ticker_name
        }));
        console.log(tickers);

        res.json(tickers);
    } catch (err) {
        console.error('Error querying the database:', err);
        res.status(500).send('Internal Server Error');
    }
    //old defintion
    //res.send(tickers);
})

router.get('/:tickerId', (req, res) => {
    const {tickerId} = req.params;
    const foundTicker = tickers.find((ticker) => ticker.ticker === tickerId)
    res.send(foundTicker);
})

router.post('/', (req, res) => {
    const ticker = req.body;
    tickers.push({...ticker});
    res.send(`${ticker.ticker} has been added to the database.`);
})

router.patch('/:tickerId', (req, res) => {
    const {tickerId} = req.params;
    const {ticker, ticker_name} = req.body;
    const tickerTest = tickers.find((ticker) => ticker.ticker === tickerId);

    if(ticker_name) tickerTest.ticker_name = ticker_name;
    res.send(`${tickerId} has been updated.`);
})

router.delete('/:tickerId', (req, res) => {
    const {tickerId} = req.params;
    tickers = tickers.filter((ticker) => ticker.ticker !== tickerId)
    res.send(`${tickerId} has been deleted.`);
})

export default router
