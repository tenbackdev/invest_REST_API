import sql from 'mssql'
import fs from 'fs';

const dbConfig = JSON.parse(fs.readFileSync('dbConfig.json', 'utf-8'));

export const getTickers = async () => {
    try {
        let pool = await sql.connect(dbConfig);
        let prods = await pool.request().query('select * from invest.lkup.ticker');
        return prods.recordsets;
    } catch (err) {
        console.log(err);
    }
};

export const getTicker = async (tickerId) => {
    try {
        let pool = await sql.connect(dbConfig);
        let prods = await pool.request()
            .input('tickerId', sql.VarChar, tickerId)
            .query('select * from invest.lkup.ticker where ticker = @tickerId');
        
        return prods.recordsets;
    } catch (err) {
        console.log(err);
    }
};

export const addTicker = async (tickerId, tickerName) => {
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('tickerId', sql.VarChar, tickerId)
            .input('tickerName', sql.VarChar, tickerName)
            .query('insert into invest.lkup.ticker (ticker, ticker_nm) values (@tickerId, @tickerName)');
        return {message: `${tickerId} added successfully.`};
    } catch (err) {
        console.log(err);
    }
};

export const updateTicker = async (tickerId, tickerName) => {
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('tickerId', sql.VarChar, tickerId)
            .input('tickerName', sql.VarChar, tickerName)
            .query(`update t
                    set t.ticker_nm = @tickerName
                    , t.last_upd_ts = getdate()
                    from invest.lkup.ticker as t
                    where 1=1
                    and t.ticker = @tickerId`);
        return {message: `${tickerId} updated successfully.`};
    } catch (err) {
        console.log(err);
    }
};
