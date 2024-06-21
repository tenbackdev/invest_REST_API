import express from 'express';
const router = express.Router();
import {getAccounts} from './dbOperations.js';

router.get('/', async (req, res) => {
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