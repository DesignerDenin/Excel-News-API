var express = require('express');
var path = require('path');
var cors = require('cors');
var bodyParser = require('body-parser');
var multer = require('multer')
var app = express();
var port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

const { Client } = require('pg')
const client = new Client({
    user: "postgres",
    password: "JnGQcofWgPuOVCK",
    connectionString: process.env.DATABASE_URL,
})

client.connect()


app.get('/', (req, res) => {
    res.send('Node js file upload rest apis');
});

app.get('/test', (req, res) => {
    client.query("SELECT current_user", (err, result) => {
        if (err) throw err;
        return res.send(result);
    })
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + "/uploads");
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

var upload = multer({ storage: storage });

app.get('/news', (req, res, next) => {
    var sql = `SELECT * FROM news ORDER BY date DESC`
    client.query(sql, (err, result) => {
        if (err) throw err;
        return res.send(result.rows);
    });
})

app.get('/news/:id', (req, res, next) => {
    var sql = `SELECT * FROM news WHERE id = ${req.params.id}`
    client.query(sql, (err, result) => {
        if (err) throw err;
        return res.send(result.rows);
    });
})

app.post('/upload-news', upload.single('dataFile'), (req, res, next) => {
    const file = req.file;
    const data = {
        title: req.body['title'],
        content: req.body['content'],
        link: req.body['link'],
        date: Date.now(),
        imageUrl: req.file.filename
    };

    if (!file)
        return res.status(400).send({ message: 'Please upload a file.' });

    var sql = `INSERT INTO news ("title", "content", "link", "date", "imageurl" )VALUES ($1, $2, $3, $4, $5) `;
    client.query(sql, [data.title, data.content, data.link, data.date, data.imageUrl], (err, result) => {
        if (err) throw err;
        return res.send(result);
    });
});

app.put('/news/:id', (req, res, next) => {
    const data = {
        title: req.body['title'],
        content: req.body['content'],
        link: req.body['link'],
    };

    var sql = `UPDATE news SET "title" = $1, "content" = $2, "link" = $3 WHERE id = $4`
    client.query(sql, [data.title, data.content, data.link, req.params.id], (err, result) => {
        if (err) throw err;
        return res.send(result);
    });
})

app.delete('/news/:id', (req, res, next) => {
    var sql = `DELETE FROM news WHERE id = $1`
    client.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        return res.send(result);
    });
})

app.listen(port, () => {
    console.log('Server started on: ' + port);
});