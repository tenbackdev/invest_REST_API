import express from 'express';
const router = express.Router();
import {getEstimatedIncome, getHistoricalIncome} from './dbOperations.js';

router.get('/estimated', async (req, res) => {
    try {
        const result = await getEstimatedIncome();    
        //note for later, figure out how to move the timezone offset somewhere DRY
        const rightNow = new Date();     
        if (result && result[0]) {
            const estIncRes = result[0].map(row => ({
                pay_date : row.pay_dt,
                pay_year : row.trans_yr,
                account_name : row.acct_nm,
                ticker : row.ticker,
                ticker_name : row.ticker_nm,
                income_announced : row.inc_status === 'Announced' ? true : false,
                income_dollars : row.trans_amt
            }))

            res.json(estIncRes);
        } else {
            throw new Error('Not a result structure');
        }
    } catch (err) {
        console.error('Error querying the database:', err);
        res.status(500).send('Internal Server Error');
    }
})

router.get('/historical/:days?', async (req, res) => {
    try {
        const histDays = req.params.days || 10000;
        const result = await getHistoricalIncome(histDays);

        if (result && result[0]) {
            const incomeRes = result[0].map(row => ({
                income_date : row.trans_dt,
                institution_name : row.inst_nm,
                account_name : row.acct_nm,
                ticker : row.ticker,
                ticker_name : row.ticker_nm,
                income_dollars : row.trans_amt,
                income_recent: row.is_rcnt_flg,
                income_reinvested: row.is_reinvested_flg
            }))
            res.json(incomeRes);
        } else {
            throw new Error('Not a result structure');
        }
    } catch (err) {
        console.error('Error querying the database:', err);
        res.status(500).send('Internal Server Error');
    }
})

router.get('/next', async (req, res) => {
    try {
        const result = await getEstimatedIncome();    
        //note for later, figure out how to move the timezone offset somewhere DRY
        const rightNow = new Date();     
        if (result && result[0]) {
            const initRes = result[0]
            const futRes = initRes 
                                .filter(item => (new Date(item.pay_dt) >= rightNow || isSameDay(item.pay_dt, rightNow) ))
                                .map(item => item.pay_dt)
            const minFutDate = futRes.reduce((min, date) => (date < min ? date : min), futRes[0]);
            const nextRes = initRes.filter(item => isSameDay(item.pay_dt, minFutDate))
                                    .map(item => item);
            res.json(nextRes);
        } else {
            throw new Error('Not a result structure');
        }
    } catch (err) {
        console.error('Error querying the database:', err);
        res.status(500).send('Internal Server Error');
    }
})

function isSameDay(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    return (
        d1.getUTCFullYear() === d2.getUTCFullYear() &&
        d1.getUTCMonth() === d2.getUTCMonth() &&
        d1.getUTCDate() === d2.getUTCDate()
    ); 
}

export default router



