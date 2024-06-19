import express from 'express';
import bodyParser from 'body-parser';
import tickerRoutes from './tickers.js'
//import dbOperations from './dbOperations.js'
import sql from './node_modules/mssql/index.js'
import fs from 'fs';

//const fs = require('fs');
const dbConfig = JSON.parse(fs.readFileSync('dbConfig.json', 'utf-8'));

const app = express();
const PORT = 5000
const db = sql.connect(dbConfig, err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to the database.')
});

/*
dbOperations.getTickers().then(result => {
    console.log(result);
})
*/

app.use(bodyParser.json());

app.use('/tickers', tickerRoutes);

//temporary place for this while testing the db connection
//will relocate to the 'tickers' route once the db connection
//detail is figured out.
app.get('/', async (req, res) =>{
    console.log('My First Get Route');
    //res.send('Hello World!');   

    const rqst = new sql.Request();
    const rslt = await rqst.query('select * from invest.lkup.ticker');

    const tickers = rslt.recordset.map(row => ({
        ticker: row.ticker,
        ticker_name: row.ticker_nm
    }));
    console.log(tickers);

    res.json(tickers);
});

//Endpoints to be added
    //GET /tickers - finds all ticker symbols
    //POST /tickers - creates a ticker symbol
    //GET /tickers/:id -gets a specific ticker symbol
    //DELETE /tickers/:id - deletes a specific ticker symbol
    //PATCH /tickers/:id - updates a specific ticker symbol
//Tutorial: https://www.freecodecamp.org/news/create-crud-api-project/
//Tutorial walks through the same endpoints for users of a different type of use case


app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));





