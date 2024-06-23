import express from 'express';
const router = express.Router();
import {getTransactionType} from './dbOperations.js';

router.get('/type', async (req, res) => {
    try {
        const result = await getTransactionType();

        if (result && result[0]) {
            const transRes = result[0].map(row => ({
                transcation_type : row.trans_type
            }))
            res.json(transRes);
        } else {
            throw new Error('Not a result structure');
        }
    } catch (err) {
        console.error('Error querying the database:', err);
        res.status(500).send('Internal Server Error');
    }
})

export default router



