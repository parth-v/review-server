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
    _id: "AAA",
    paperId: 'aa',
    commentz: [
      {
        name: 'User1',
        message: 'I think the article is great!!',
        time: "On 3/8/2020 At 23:15"
      },
      {
        name: 'User2',
        message: 'Its perfect!!',
        time: "On 3/8/2020 At 23:45"
      }
    ]
  }
];

var users = [
  {
    _id: '1',
    email: 'admin@g.com',
    password: 'admin',
    role: "admin"
  },
  {
    _id: '2',
    email: 'author@g.com',
    password: 'author',
    role: "author",
    papers: [
      "aa",
      "bb"
    ]
  },
  {
    _id: '3',
    email: 'reviewer@g.com',
    password: 'reviewer',
    role: "reviewer",
    papers: [
      "aa"
    ]
  }
];

var papers = [
  {
    _id: "aa",
    name: "Sample.pdf",
    userId: "1",
    comments: [
      "AAA"
    ]
  },
  {
    _id: "bb",
    name: "Dummy.pdf",
    userId: "2"
  }
];
// const today = new Date();
// const date = today.getDate() + '/' + (today.getMonth()+1) + '/' + today.getFullYear();
// const time = today.getHours() + ":" + today.getMinutes();
// const dateTime = 'On ' + date + ' At '+ time;

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
  let date = today.getDate() + '/' + (today.getMonth()+1) + '/' + today.getFullYear();
  let time = today.getHours() + ":" + today.getMinutes();
  let dateTime = 'On ' + date + ' At '+ time;
  const comment = { name, message, time:dateTime };
  comments.push(comment);
  return res.status(200).json(comment);
});

app.get('/viewComments/:id', async (req, res) => {
  let paperId = req.params.id;
  let commentBlock = comments.filter(comment => comment.paperId === paperId);
  if(commentBlock.length === 0){
    return res.json(commentBlock);
  }
  return res.json(commentBlock[0].commentz);
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

app.get('/papers', async (req, res) => {
  //const tracks = await Track.find({ userId: req.user._id });
  //res.send(tracks); 
  //const dir = './uploads';
  //const files = await fs.promises.readdir(dir);
  const id = req.body.id;
  const papersFilter = papers.filter(file => file.userId===id);
  return res.json(papersFilter);
});

app.get('/users', async (req,res) => {
  return res.json(users);
});

app.get('/paper', async (req, res) => {
  const paper = papers.filter(paper => paper._id === req.body.id);
  return res.json(paper);
});

app.get('/user', async(req, res) => {
  const user = users.filter(user => user._id === req.body.id);
  return res.json(user);
});

app.get('/papercomm', async (req, res) => {
  const id = req.body.id;
  const commentes = comments.filter(comment => comment.paperId===id);
  if(commentes.length>0)
  {
    //console.log(commentes, commentes.commentz);
    return res.json(commentes[0].commentz);
  }
  else {
    return res.json(commentes);
  }
});

// app.post('/paper', async (req, res) => {
//   const { name, files, user } = req.body;

//   if(!name || !files || !user) {
//     return res.status(422).send({ error: 'You must provide name and files'});
//   }

//   // try {
//   //   const track = new Track({ name, files, userId: req.user._id });
//   //   await track.save();
//   //   res.send(track);
//   // } catch(err) {
//   //   res.status(422).send({ error: err.message }); 
//   // }
// });

app.listen(8000, () => console.log('App running on port 8000') );