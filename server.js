const express = require('express')
const fileUpload = require('express-fileupload');
const fs = require('fs');
const convertDocx2Pptx = require('./main');
const jwt = require('jsonwebtoken');
const app = express()
const port = 3000

const APP_SECRET = '0eaa4e49c1d276b7b57b2d668c4c22ed';
app.use(fileUpload({
  uriDecodeFileNames: true,
}));

function middlewareCheckAuthingToken(req, res, next){
  try {
    const access_token = req.headers['authing-jwt-token'];
    let decoded = jwt.verify(access_token, APP_SECRET),
      expired = Date.parse(new Date()) / 1000 > decoded.exp;
    if (expired) {
      // 过期
      res.sendStatus(403);
    } else {
      console.log('token is right');
      next();
    }
  } catch (error) {
    res.sendStatus(403);
  }
}
app.use('/api/*',middlewareCheckAuthingToken);
app.get('/api/download',(req,res)=>{
  const filePath = __dirname + '/question.pptx';
  const fileName = 'question.pptx'
  res.set({
      'content-type': 'application/octet-stream',
      'content-disposition': 'attachment;filename=' + encodeURI(fileName)
  })
  fs.createReadStream(filePath).pipe(res)
})

app.post('/api/upload', (req,res)=>{
    if(!req.files || Object.keys(req.files).length === 0){
      return res.status(400).send('no file?');
    }
    const file = req.files.file;
    const fileName = 'test.docx';
    const filePath = __dirname + '/tmp/docx/'+ fileName;
    file.mv(filePath,async (err)=>{
      if(err){
        console.log(err);
        return res.status(500).send(err);
      }
      const pptPath = await convertDocx2Pptx(filePath);
      fs.unlinkSync(filePath);
      console.log(pptPath);
      res.send('ok');
    })
})
app.use(express.static('mang_ui/dist'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})