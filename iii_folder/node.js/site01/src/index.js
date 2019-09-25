// 引入express
const express = require('express');
const url = require('url');
const bodyParser = require('body-parser');
const multer= require('multer');
const upload = multer({dest:'tmp_uploads/'})
const fs = require('fs');

// 建立web server 物件 
const app = express();

const urlencodedParser = bodyParser.urlencoded({extended: false}); // false為沒有安裝 qs lib
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// 樣板引擎設定
app.set('view engine', 'ejs');

// 設定靜態資料夾
app.use(express.static('public'));

// routes
app.get('/', (req, res)=>{

    res.render('home', {name:'one-one'});
    // res.send('snoopy');
});
//////////////////////////////產生動態檔案 因為沒有b.html
app.get('/b.html', (req,res) =>{
    res.send(`<h2>Hello World!</h2>`);
});
///////////////////////////////////////////////////////
app.get('/sales01',(req, res)=>{
        const data = require('./../data/sales01');
        //res.send(JSON.stringify(sales));
        // res.json(sales);
        res.render('sales01',{
            sales: data 
        });
    })
/////////////////////////////////queryString//////////////////////////////////
app.get('/try-qs',(req, res)=>{
    const urlParts = url.parse(req.url, true);
    console.log(urlParts);
    //res.send(JSON.stringify(sales));
    // res.json(sales);
    res.render('try-qs',{
        query: urlParts.query
    });
})
/////////////////////////////////queryString//////////////////////////////////

////////////////////////////////get與post差別/////////////////////////////////
app.get('/try-post-form', (req, res)=>{
    res.render('try-post-form');
})

app.post('/try-post-form', urlencodedParser, (req, res)=>{
    res.render('try-post-form', req.body);

    // res.send(JSON.stringify(req.body));
})
////////////////////////////////get與post差別/////////////////////////////////
app.get('/try-post-form2', (req, res)=>{
    res.send('get: try-post-form2');
});
app.post('/try-post-form2', (req, res)=>{
    res.json(req.body);

    //res.send(JSON.stringify(req.body));
});
app.put('/try-post-form2', (req, res)=>{
    res.send("PUT: try-post-form2");
});

app.post('/try_upload',upload.single('avatar'),(req, res)=>{
    if(req.file && req.file.originalname) {  //////如果只判斷req.file但檔案為空 仍會看成是true
        console.log(req.file);

        switch(req.file.mimetype) {
            case 'image/png':
            case 'image/jpeg':
                fs.createReadStream(req.file.path)
                    .pipe(
                        fs.createWriteStream('public/img/' + req.file.originalname)
                    );
                    res.send('ok');
                break;
            default:
                return res.send('ohoh bad file type');
        }
    } else {
        res.send('ohoh no uploads');
    }
})
///////////////////////////////////////////////////////////////////////
app.get('/my-params1/:action?/:id?',(req, res)=>{ //action 和 id 是可以自己取的變數名稱  ?表示可有可無此屬性
    res.json(req.params);
})

app.get('/my-params2/*/*?',(req, res)=>{ // * 代表所有的東西  轉譯後會設定成{索引值:*}
    res.json(req.params);
})

app.get(/^\/09\d{2}\-?\d{3}\-?\d{3}$/, (req, res)=>{
    let str = req.url.slice(1);
    str = str.split('?')[0]; // 將get參數切除
    str = str.split('-').join('');
    res.send('手機:' + str);
})
////////////////////////////////////////////////////////////////////////////

//////////////////////////////模組化start///////////////////////////////
//1
const admin1 = require(__dirname + '/admins/admin1');
admin1(app);
//2
app.use(require(__dirname + '/admins/admin2'));
//3
app.use('/abc', require(__dirname + '/admins/admin3'));
// baseUrl
//會員管理example
app.use('/admin4',require(__dirname + '/admins/admin4'))
//////////////////////////////模組化end///////////////////////////////



// 自訂404頁面  須放在路由設定的後面
app.use((req,res)=>{
    res.type('text/plain');
    res.status(404);
    res.send('404----error---sorry')
}) 


// server 偵聽
app.listen(3000, ()=>{
    console.log('server started 3000')
})