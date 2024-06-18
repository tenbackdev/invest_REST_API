import express from 'express';
const router = express.Router();

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
        const rqst = new sql.Request();
        const rslt = await rqst.query('select * from invest.lkup.tickers');

        const tickers = rslt.recordset.map(row => ({
            ticker: tickers.ticker,
            ticker_name: tickers.ticker_name
        }));

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
