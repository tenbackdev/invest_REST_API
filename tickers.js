import express from 'express';
const router = express.Router();
import * as dbOperations from './dbOperations.js';

router.get('/', async (req, res) => {
    try {
        await dbOperations.getTickers().then(result => {
            res.json(result[0]);
        })
    } catch (err) {
        console.error('Error querying the database:', err);
        res.status(500).send('Internal Server Error');
    }
})

export default router