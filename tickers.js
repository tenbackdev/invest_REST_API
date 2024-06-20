import express from 'express';
const router = express.Router();
import * as dbOperations from './dbOperations.js';

router.get('/', async (req, res) => {
    try {
        const result = await dbOperations.getTickers();

        if (result && result[0]) {
            const tickerRes = result[0].map(row => ({
                ticker: row.ticker,
                ticker_name: row.ticker_nm
            }));
            res.json(tickerRes);
        } else {
            throw new Error('Not a result structure');
        }
    } catch (err) {
        console.error('Error querying the database:', err);
        res.status(500).send('Internal Server Error');
    }
})

router.get('/:tickerId', async (req, res) => {
    try {
        const {tickerId} = req.params;
        const result = await dbOperations.getTicker(tickerId);

        if (result && result[0]) {
            const tickerRes = result[0].map(row => ({
                ticker: row.ticker,
                ticker_name: row.ticker_nm
            }));
            res.json(tickerRes);
        } else {
            throw new Error('Not a result structure');
        }
    } catch (err) {
        console.error('Error querying the database:', err);
        res.status(500).send('Internal Server Error');
    }
})

router.post('/', async (req, res) => {
    try {
        const {ticker, ticker_name} = req.body;
        const getResult = await dbOperations.getTicker(ticker);
        if (getResult[0].length > 0) {
            res.status(500).send(`Ticker ${ticker} already exists.`);
        } else {
            const result = await dbOperations.addTicker(ticker, ticker_name);
            res.status(201).json(result);
        }
    } catch (err) {
        console.error('Error querying the database:', err);
        res.status(500).send('Internal Server Error');
    }
})

router.patch('/:tickerId', async (req, res) => {
    try {
        const tickerId = req.params.tickerId;
        const {ticker, ticker_name} = req.body;
        const getResult = await dbOperations.getTicker(ticker);
        if (getResult[0].length === 0) {
            res.status(500).send(`Ticker ${ticker} does not exist.`);
        } else if (tickerId !== ticker) {
            res.status(500).send(`Ticker ${ticker} and ${tickerId} do not match.`);
        } else {
            const result = await dbOperations.updateTicker(ticker, ticker_name);
            res.status(201).json(result);
        }
    } catch (err) {
        console.error('Error querying the database:', err);
        res.status(500).send('Internal Server Error');
    }
})

export default router