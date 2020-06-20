var express = require('express');
const fs = require('fs');
var app = express();
var multer = require('multer')
var cors = require('cors');
app.use(cors());

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

// let hi = async () => {
  
// } 
// hi();

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

app.listen(8000, () => console.log('App running on port 8000') );