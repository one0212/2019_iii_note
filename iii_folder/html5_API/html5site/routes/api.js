var express = require('express');
var router = express.Router();
var multer  = require('multer')
var fs = require("fs");
const request = require('request');
const zlib = require('zlib');

var uploadFolder = 'public/uploads/';
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);    
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);  
    }
});
var upload = multer({ storage: storage })


//http://localhost:3000/api/ > 路由(Route) > 執行的程式
router.get('/',function(req,res,next){  
  //setTimeout(function() {
    res.setHeader('Content-type', 'text/plain');
    res.charset = 'UTF-8';
    res.write("Hello, world");
    res.end();
  //}, 8000);
})

//http://localhost:3000/api/jsonhandler
router.get('/jsonhandler',function(req,res,next){
  var jsonData = [
    {name: "Jack",age: "29",email: "Jack@gmail.com"},
    {name: "Mary",age: "21",email: "Mary@hotmail.com"},
    {name: "Tom",age: "35",email: "Tom@yahoo.com"}];
    res.json(jsonData);
})

http://localhost:3000/api/upload
//upload.any()
router.post('/upload',upload.single('myFile'),function(req,res,next){
  res.send(req.file);
})


http://localhost:3000/api/base64
router.post('/base64', upload.fields([]), (req, res) => {
  let formData = req.body;
  fs.writeFile('public/uploads/'+formData.id+'.png', formData.imageData, {encoding: 'base64'}, function(err) {
       res.send('檔案上傳成功!!');
   });
 
});


// http://localhost:3000/api/events
router.get('/events', function(req, res, next) {
  res.writeHead(200,{
    "Content-Type":"text/event-stream",
    "Connection":"keep-alive",
    "Cache-Control":"no-cache"
  })
  setInterval(function(){
    res.write('data:' + (new Date()).toLocaleTimeString() + '\n\n');
  },1000)
  res.write('data:' + (new Date()).toLocaleTimeString() + '\n\n');
});

//http://localhost:3000/api/youbike
router.get('/youbike',function(req,res,next){
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
});
setInterval(function(){
  // 要求http://data.taipei/youbike的資料 
 // https://tcgbusfs.blob.core.windows.net/blobyoubike/YouBikeTP.json
 request('https://tcgbusfs.blob.core.windows.net/blobyoubike/YouBikeTP.json',{'encoding':null},function(err,response,body){
      res.write("data: " + body + '\n\n');  

  })
},60000)
request('https://tcgbusfs.blob.core.windows.net/blobyoubike/YouBikeTP.json',{'encoding':null},function(err,response,body){
  res.write("data: " + body + '\n\n')
  })
  
})




module.exports = router;
