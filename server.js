const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const app = express();
const multer = require('multer')
const cors = require('cors');
const mail = require('./src/MailService/mail');
const bodyParser = require('body-parser');
//const requireAuth = require('./middlewares/requireAuth');
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

var users = [
  {
    _id: '1',
    email: 'Rohan@gmail.com',
    password: 'roh'
  },
  {
    _id: '2',
    email: 'Raju@yahoo.com',
    password: 'raj'
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
// app.get('/',requireAuth, (req, res) => {
//   res.send(`Your email: ${ req.user.email }`);
// });

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

app.post('/signup', async (req, res) => {
  
  const { email, password } = req.body;
  try {
    //const user = new User({ email, password });
    //await user.save();
    const user = users.push({ _id:'3', email, password });
    console.log(users);
    const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');
    res.send({ token });
  } catch(err) {
    return res.status(422).send(err.message);
  }
});

app.post('/signin',async (req, res) => {
  const { email, password } = req.body;
  //console.log(email, password);

  if(!email || !password) {
    return res.status(422).send({ error: 'Must provide email and password' });
  }

  //const user = await User.findOne({ email });
  const user = users.find((user) => user.email === email);

  if(!user) {
    //return res.status(400).json("Wrong credentials!");
    return res.status(422).send({ error: 'Invalid email or password' });
  }

  try {
    //await user.comparePassword(password);
    if(user.password !== password) { throw new Error(); }
    const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');
    res.send({ token });
  } catch (err) {
    return res.status(422).send({ error: 'Invalid email or password' });
  }
});

app.listen(8000, () => console.log('App running on port 8000') );