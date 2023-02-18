var express = require('express');
var path = require('path');
var cors = require('cors');
var bodyParser = require('body-parser');
var multer = require('multer')
var db = require('./database');
var app = express();
var port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));


app.get('/', (req, res) => {
    res.send('Node js file upload rest apis');
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now().toISOString().replace(/:/g, '-')}${path.extname(file.originalname)}`);
    }
});

var upload = multer({ storage: storage });

app.post('/upload-news', upload.single('dataFile'), (req, res, next) => {
    const file = req.file;
    const data = {
        title: req.body['title'],
        description: req.body['description'],
        link: req.body['link'],
        date: Date.now(),
        imageUrl: req.file.filename
    };

    if (!file)
        return res.status(400).send({ message: 'Please upload a file.' });

    var sql = `INSERT INTO DataTable SET ? `;
    db.query(sql, data, (err, result) => {
        if (err) throw err;
        return res.send(result);
    });
});

app.listen(port, () => {
    console.log('Server started on: ' + port);
});