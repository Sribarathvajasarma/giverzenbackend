const mysql = require('mysql')
const db = mysql.createPool({
    host: 'bwucm1oqy01hflaihcxo-mysql.services.clever-cloud.com',
    user: 'us7r4bzisxmpzewh',
    password: 'edD8RGTXlztMvVMujCjx',
    database: 'bwucm1oqy01hflaihcxo',
    port: 3306,
})



module.exports = db




