//import express from 'express';
import sql from 'mssql'
import fs from 'fs';
//const router = express.Router();
//export default dbOperations

const dbConfig = JSON.parse(fs.readFileSync('dbConfig.json', 'utf-8'));
/*
const db = sql.connect(dbConfig, err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to the database.')
});
*/

export const getTickers = async () => {
    try {
        let pool = await sql.connect(dbConfig);
        let prods = await pool.request().query('select * from invest.lkup.ticker');
        return prods.recordsets;
    } catch (err) {
        console.log(err);
    }
};

/*
async function getTickers() {
    try {
        let pool = await sql.connect(dbConfig);
        let prods = pool.request.query('select * from invest.lkup.ticker');
        return prods.recordsets;
    } catch (err) {
        console.log(err);
    }
}
*/

/*
module.exports = {
    getTickers : getTickers
}
*/

//export default dbOperations
