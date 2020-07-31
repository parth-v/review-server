var express = require('express');
const fs = require('fs');
var app = express();
var multer = require('multer')
var cors = require('cors');
var mail = require('./src/MailService/mail');
var bodyParser = require('body-parser')
var comments = [
  {
    name: 'User1',
    message: 'I think the article is great!!',
    time: ''
  },
  {
    name: 'User2',
    message: 'Its perfect!!',
    time: ''
  }
];
const today = new Date();
const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
const dateTime = date+' '+time;
comments[0].time = dateTime;
comments[1].time = dateTime;

app.use(cors());
app.use(bodyParser.json());

//mail.sendEmail();

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname );
  }
});

var upload = multer({ storage }).array('file');

app.post('/upload',(req, res) => {
  upload(req, res, (err) => {
	  if (err instanceof multer.MulterError) {
	      return res.status(500).json(err);
	  } else if (err) {
       return res.status(500).json(err);
    }
    return res.status(200).send(req.file);
  });
});

app.get('/view', async (req, res) => {
  const dir = './uploads';
  const files = await fs.promises.readdir(dir);
  return res.json(files);
});

app.get('/download', (req, res) => {
  const dir = './uploads/';
  const filePath = dir + req.query.name;
  console.log(filePath);
  return res.download(filePath);
});

app.post('/comment', (req, res) => {
  const name = req.body.name;
  const message = req.body.message;
  let today = new Date();
  let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  let dateTime = date+' '+time; 
  const comment = { name, message, time:dateTime };
  comments.push(comment);
  return res.status(200).json(comment);
});

app.get('/viewComments', async (req, res) => {
  return res.json(comments);
});

app.listen(8000, () => console.log('App running on port 8000') );