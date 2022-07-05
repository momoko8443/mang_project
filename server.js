const express = require('express')
const fileUpload = require('express-fileupload');
const app = express()
const port = 3000
app.use(fileUpload());

app.use('/api/upload', (req,res)=>{
    console.log(req.files);
    
    res.sendStatus(200);
})
app.use(express.static('mang_ui/dist'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})