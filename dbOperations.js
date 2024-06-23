import sql from 'mssql'
import fs from 'fs';

/* ============================ General - Start ============================ */

const dbConfig = JSON.parse(fs.readFileSync('dbConfig.json', 'utf-8'));

async function getConnection() {
    try {
        const pool = await sql.connect(dbConfig);
        return pool;
    } catch (err) {
        throw new Error('Database connection failed.')
    }
}

/* ============================= General - End ============================= */

/* ============================ Accounts - Start ============================ */

export const getAccounts = async () => {
    try {
        let pool = await getConnection();
        let prods = await pool.request().query('select * from invest.rpt.v_acct');
        return prods.recordsets;
    } catch (err) {
        console.log(err);
    }
};

/* ============================= Accounts - End ============================= */

/* ============================ Balances - Start ============================ */

export const getCurrentBalances = async () => {
    try {
        let pool = await getConnection();
        let prods = await pool.request().query('select * from invest.rpt.v_acct_bal_cur');
        return prods.recordsets;
    } catch (err) {
        console.log(err);
    }
};

export const getHistoricalBalances = async (histDays) => {
    try {
        let pool = await getConnection();
        let prods = await pool.request()
                            .input('hist_days', sql.Int, histDays)                    
                            .query(`declare @bgn_dt date = cast(getdate() - @hist_days as date)
                                    select * 
                                    from invest.rpt.v_acct_bal_snsh as s
                                    where 1=1
                                    and s.snsh_dt >= @bgn_dt`);
        return prods.recordsets;
    } catch (err) {
        console.log(err);
    }
};


/* ============================= Balances - End ============================= */

/* ============================= Income - Start ============================= */

export const getHistoricalIncome = async (histDays) => {
    try {
        let pool = await getConnection();
        let prods = await pool.request()
                            .input('hist_days', sql.Int, histDays)                    
                            .query(`declare @bgn_dt date = cast(getdate() - @hist_days as date)
                                    select * 
                                    from invest.rpt.v_acct_inc_hist as s
                                    where 1=1
                                    and s.trans_dt >= @bgn_dt`);
        return prods.recordsets;
    } catch (err) {
        console.log(err);
    }
};

/* ============================== Income - End ============================== */

/* ============================ Tickers - Start ============================ */

export const getTickers = async () => {
    try {
        let pool = await getConnection();
        let prods = await pool.request().query('select * from invest.rpt.v_ticker');
        return prods.recordsets;
    } catch (err) {
        console.log(err);
    }
};

export const getTicker = async (tickerId) => {
    try {
        let pool = await getConnection();
        let prods = await pool.request()
            .input('tickerId', sql.VarChar, tickerId)
            .query('select * from invest.rpt.v_ticker where ticker = @tickerId');
        
        return prods.recordsets;
    } catch (err) {
        console.log(err);
    }
};

export const addTicker = async (tickerId, tickerName) => {
    try {
        let pool = await getConnection();
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
        let pool = await getConnection();
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

export const deleteTicker = async (tickerId) => {
    try {
        let pool = await getConnection();
        await pool.request()
            .input('tickerId', sql.VarChar, tickerId)
            .query(`delete t
                    from invest.lkup.ticker as t
                    where 1=1
                    and t.ticker = @tickerId`);
        return {message: `${tickerId} removed successfully.`};
    } catch (err) {
        console.log(err);
    }
};

/* ============================= Tickers - End ============================= */

/* ========================== Transaction - Start ========================== */

export const getTransactionType = async () => {
    try {
        let pool = await getConnection();
        let prods = await pool.request().query('select * from invest.rpt.v_trans_type');
        return prods.recordsets;
    } catch (err) {
        console.log(err);
    }
};

/* =========================== Transaction - End =========================== */
