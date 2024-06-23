import express from 'express';
const router = express.Router();
import {getHistoricalIncome} from './dbOperations.js';

router.get('/:days?', async (req, res) => {
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
        const result = await getAccounts();

        if (result && result[0]) {
            const accountsRes = result[0].map(row => ({
                account_id : row.acct_id,
                account_name: row.acct_nm,
                account_number: row.acct_nbr.includes('-')
                                    ? row.acct_nbr.slice(-4)
                                    : row.acct_nbr,
                institution_name: row.inst_nm
            }))
            res.json(accountsRes);
        } else {
            throw new Error('Not a result structure');
        }
    } catch (err) {
        console.error('Error querying the database:', err);
        res.status(500).send('Internal Server Error');
    }
})

export default router



