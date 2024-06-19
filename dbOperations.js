import sql from 'mssql'
import fs from 'fs';
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

async function getTickers() {
    try {
        let pool = await sql.connect(dbConfig);
        let prods = pool.request.query('select * from invest.lkup.ticker');
        return prods.recordsets;
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getTickers : getTickers
}

