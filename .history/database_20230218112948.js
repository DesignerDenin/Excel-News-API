var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
});

conn.connect(function (err) {
    if (err) throw err;
    console.log('Database is connected successfully !');
});

var sql = "CREATE DATABASE IF NOT EXISTS excel"
conn.query(sql, (err) => {
    if (err) throw err;
    console.log("Database established");
});

var sql = "USE excel"
conn.query(sql, (err) => {
    if (err) throw err;
    console.log("Database connected");
});

var sql = "CREATE TABLE IF NOT EXISTS news (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255), content VARCHAR(255), link VARCHAR(255), imageUrl VARCHAR(255))";
conn.query(sql, (err) => {
    if (err) throw err;
    console.log("Table Created");
});

module.exports = conn;