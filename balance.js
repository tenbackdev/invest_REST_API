import express from 'express';
const router = express.Router();
import {getCurrentBalances, getHistoricalBalances} from './dbOperations.js';

router.get('/current', async (req, res) => {
    try {
        const result = await getCurrentBalances();

        if (result && result[0]) {
            const accountsRes = result[0].map(row => ({
                snapshot_date : row.snsh_dt,
                institution_name: row.inst_nm,
                account_name: row.acct_nm,
                account_balance: row.acct_bal
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

router.get('/historical/:days?', async (req, res) => {
    try {
        const histDays = req.params.days || 90;
        const result = await getHistoricalBalances(histDays);

        if (result && result[0]) {
            const accountsRes = result[0].map(row => ({
                snapshot_date : row.snsh_dt,
                institution_name: row.inst_nm,
                account_name: row.acct_nm,
                account_balances: row.acct_bal
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