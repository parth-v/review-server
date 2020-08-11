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
    articleId: 'aa',
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
    name: "Admin",
    email: 'admin@g.com',
    password: 'admin',
    role: "admin"
  },
  {
    _id: '2',
    name:"Author",
    email: 'author@g.com',
    password: 'author',
    role: "author",
    articles: [
      "aa",
      "bb"
    ]
  },
  {
    _id: '3',
    name:"Reviewer",
    email: 'reviewer@g.com',
    password: 'reviewer',
    role: "reviewer",
    articles: [
      "aa"
    ]
  }
];

var articles = [
  {
    _id: "aa",
    location: "1596461666683-sample.pdf",
    name: "2020 Vol 10",
    status: "Published",
    abstract: "Integral equations for the analysis of microstrip reflectarrays consisting of thin perfectly conducting patches generally employ edge conditions in the basis functions for good convergence. The finite conductivity of a practical structure is treated as a perturbation by using the well-known Leontovich boundary condition. The Galerkin technique for the latter results in diverging integrals in moment matrix elements corresponding to edge conditions in basis functions approaching infinity across the current flow direction. Previously a criterion to stop the evaluation of the diverging integrals at a distance from the edge was proposed. In this article we show that excellent results may be achieved by simply eliminating relevant edge conditions in the testing functions in the moment method.",
    userId: "2",
    authorEmail: "author@g.com",
    comments: [
      "AAA"
    ]
  },
  {
    _id: "bb",
    location: "1596461666686-dummy.pdf",
    name: "2020 Vol 20",
    status: "Review pending",
    authorEmail: "author@g.com",
    abstract: "Integral equations for the analysis of microstrip reflectarrays consisting of thin perfectly conducting patches generally employ edge conditions in the basis functions for good convergence. The finite conductivity of a practical structure is treated as a perturbation by using the well-known Leontovich boundary condition. The Galerkin technique for the latter results in diverging integrals in moment matrix elements corresponding to edge conditions in basis functions approaching infinity across the current flow direction. Previously a criterion to stop the evaluation of the diverging integrals at a distance from the edge was proposed. In this article we show that excellent results may be achieved by simply eliminating relevant edge conditions in the testing functions in the moment method.",
    userId: "2",
    comments: [
    ]
  },
  {
    _id: "cc",
    location: "1596463893931-sample.pdf",
    name: "2020 Vol 30",
    status: "Review pending",
    abstract: "Integral equations for the analysis of microstrip reflectarrays consisting of thin perfectly conducting patches generally employ edge conditions in the basis functions for good convergence. The finite conductivity of a practical structure is treated as a perturbation by using the well-known Leontovich boundary condition. The Galerkin technique for the latter results in diverging integrals in moment matrix elements corresponding to edge conditions in basis functions approaching infinity across the current flow direction. Previously a criterion to stop the evaluation of the diverging integrals at a distance from the edge was proposed. In this article we show that excellent results may be achieved by simply eliminating relevant edge conditions in the testing functions in the moment method.",
    userId: "2",
    authorEmail: "author@g.com",
    comments: [
    ]
  },
  {
    _id: "dd",
    location: "1596463893932-dummy.pdf",
    name: "2020 Vol 39",
    status: "Published",
    abstract: "Integral equations for the analysis of microstrip reflectarrays consisting of thin perfectly conducting patches generally employ edge conditions in the basis functions for good convergence. The finite conductivity of a practical structure is treated as a perturbation by using the well-known Leontovich boundary condition. The Galerkin technique for the latter results in diverging integrals in moment matrix elements corresponding to edge conditions in basis functions approaching infinity across the current flow direction. Previously a criterion to stop the evaluation of the diverging integrals at a distance from the edge was proposed. In this article we show that excellent results may be achieved by simply eliminating relevant edge conditions in the testing functions in the moment method.",
    userId: "2",
    authorEmail: "author@g.com",
    comments: [
    ]
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
  //console.log(req.body, req.files);
  //return res.json("success");
  upload(req, res, (err) => {
    const {name, abstract} = req.body;
    const size = articles.length;
    const _id = articles[size-1]+1; 
    const article = {
      _id,
      location:req.files.filename,
      name,
      abstract, 
      userId:"2", 
      authorEmail: "author@g.com",
      comments: []
    }
    articles.push(article); 
	  if (err instanceof multer.MulterError) {
	      return res.status(500).json(err);
	  } else if (err) {
       return res.status(500).json(err);
    }
    return res.status(200).send(req.files);
  });
});

app.get('/articles', async (req, res) => {
  // const dir = './uploads';
  // const files = await fs.promises.readdir(dir);
  // return res.json(files);
  return res.json(articles);
});

app.get('/download/:name', (req, res) => {
  const dir = './uploads/';
  const filePath = dir + req.params.name;
  //console.log(filePath);
  return res.download(filePath);
});

app.post('/comment', (req, res) => {
  const name = req.body.comment.name;
  const message = req.body.comment.message;
  let today = new Date();
  let date = today.getDate() + '/' + (today.getMonth()+1) + '/' + today.getFullYear();
  let time = today.getHours() + ":" + today.getMinutes();
  let dateTime = 'On ' + date + ' At '+ time;
  const comment = { name, message, time:dateTime };
  comments.push(comment);
  //console.log(comment);
  return res.status(200).json(comment);
});

app.get('/comments/:id', async (req, res) => {
  let articleId = req.params.id;
  let commentBlock = comments.filter(comment => comment.articleId === articleId);
  if(commentBlock.length === 0){
    return res.json(commentBlock);
  }
  return res.json(commentBlock[0].commentz);
});

app.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;
  if(!email || !password || !name) {
    return res.status(422).send({ error: 'Must provide all the details!' });
  }
  try {
    //const user = new User({ email, password });
    //await user.save();
    const id = "" + users.length+1;
    const user = users.push({ _id:id,name, email, password, role: "author", articles: [] });
    //console.log(users);
    const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');
    {let { password, ...userDetail } = user;
    res.send({ token, userDetail });}
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
    {let { password, ...userDetail } = user;
    //console.log({ token, userDetail });
    res.send({ token, userDetail });}
  } catch (err) {
    return res.status(422).send({ error: 'Invalid email or password' });
  }
});

app.get('/articles/:id', async (req, res) => {
  //const tracks = await Track.find({ userId: req.user._id });
  //res.send(tracks); 
  //const dir = './uploads';
  //const files = await fs.promises.readdir(dir);
  const id = req.params.id;
  const articlesFilter = articles.filter(file => file.userId===id);
  return res.json(articlesFilter);
});

app.get('/users', async (req,res) => {
  return res.json(users);
});

app.get('/article/:id', async (req, res) => {
  const article = articles.filter(article => article._id === req.body.id);
  return res.json(article);
});

app.get('/user', async(req, res) => {
  const user = users.filter(user => user._id === req.body.id);
  return res.json(user);
});

app.get('/articlecomments/:id', async (req, res) => {
  const id = req.params.id;
  const commentes = comments.filter(comment => comment.articleId===id);
  if(commentes.length>0)
  {
    //console.log(commentes, commentes.commentz);
    return res.json(commentes[0].commentz);
  }
  else {
    return res.json(commentes);
  }
});

// app.post('/article', async (req, res) => {
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