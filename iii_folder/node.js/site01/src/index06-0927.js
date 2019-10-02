// 引入express
const express = require('express');
const url = require('url');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: 'tmp_uploads/' })
const fs = require('fs');
const session = require('express-session');
const moment = require('moment-timezone');
const mysql = require('mysql');
const bluebird = require('bluebird');
const cors = require('cors');
const db = mysql.createConnection({
    host: '35.201.219.20',
    user: 'skier',
    password: 'XmpP8u42',
    database: 'SKI'
})
db.connect();

bluebird.promisifyAll(db);

// 建立web server 物件 
const app = express();

const urlencodedParser = bodyParser.urlencoded({ extended: false }); // false為沒有安裝 qs lib
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 設定靜態資料夾
app.use(express.static('public'));
app.use(cors());
////////////////////////////////////////session//////////////////////////////////////
app.use(session({
    saveUninitialized: false,   // 沒使用到session時是否自動建立session  default false
    resave: false,  //沒變更內容時是否強制回存
    secret: 'qszwsxedc', //加密字串
    cookie: {
        maxAge: 1200000,   // 20 單位:毫秒
    }
}));


// 樣板引擎設定
app.set('view engine', 'ejs');



// routes
app.get('/', (req, res) => {

    res.render('home', { name: 'one-one' });
    // res.send('snoopy');
});
//////////////////////////////產生動態檔案 因為沒有b.html
app.get('/b.html', (req, res) => {
    res.send(`<h2>Hello World!</h2>`);
});
///////////////////////////////////////////////////////
app.get('/sales01', (req, res) => {
    const data = require('./../data/sales01');
    //res.send(JSON.stringify(sales));
    // res.json(sales);
    res.render('sales01', {
        sales: data
    });
})
/////////////////////////////////queryString//////////////////////////////////
app.get('/try-qs', (req, res) => {
    const urlParts = url.parse(req.url, true);
    console.log(urlParts);
    //res.send(JSON.stringify(sales));
    // res.json(sales);
    res.render('try-qs', {
        query: urlParts.query
    });
})
/////////////////////////////////queryString//////////////////////////////////

////////////////////////////////get與post差別/////////////////////////////////
app.get('/try-post-form', (req, res) => {
    res.render('try-post-form');
})

app.post('/try-post-form', urlencodedParser, (req, res) => {
    res.render('try-post-form', req.body);

    // res.send(JSON.stringify(req.body));
})
////////////////////////////////get與post差別/////////////////////////////////
app.get('/try-post-form2', (req, res) => {
    res.send('get: try-post-form2');
});
app.post('/try-post-form2', (req, res) => {
    res.json(req.body);

    //res.send(JSON.stringify(req.body));
});
app.put('/try-post-form2', (req, res) => {
    res.send("PUT: try-post-form2");
});

app.post('/try_upload', upload.single('avatar'), (req, res) => {
    if (req.file && req.file.originalname) {  //////如果只判斷req.file但檔案為空 仍會看成是true
        console.log(req.file);

        switch (req.file.mimetype) {
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
app.get('/my-params1/:action?/:id?', (req, res) => { //action 和 id 是可以自己取的變數名稱  ?表示可有可無此屬性
    res.json(req.params);
})

app.get('/my-params2/*/*?', (req, res) => { // * 代表所有的東西  轉譯後會設定成{索引值:*}
    res.json(req.params);
})

app.get(/^\/09\d{2}\-?\d{3}\-?\d{3}$/, (req, res) => {
    let str = req.url.slice(1);
    str = str.split('?')[0]; // 將get參數切除
    str = str.split('-').join('');
    res.send('手機:' + str);
})
////////////////////////////////0926/////////////////////////////////////
app.get('/try-session', (req, res) => {
    req.session.my_views = req.session.my_views || 0;
    req.session.my_views++;

    res.json({
        aa: 'hi~~~',
        'my views': req.session.my_views
    })
})
app.get('/try-moment', (req, res) => {
    const fm = 'YYYY-MM-DD HH:mm:ss';
    const mo1 = moment(req.session.cookie.expires);
    const mo2 = moment(new Date());
    res.contentType('text/plain');  // contentType()
    res.write(req.session.cookie.expires + "\n"); //res.write(req.session.cookie.expires.toString());
    res.write(req.session.cookie.expires.constructor.name + "\n");
    res.write(new Date() + "\n");
    res.write(mo1.format(fm) + "\n");
    res.write(mo2.format(fm) + "\n");
    res.write('倫敦 ' + mo1.tz('Europe/London').format(fm) + "\n");
    res.write('東京 ' + mo2.tz('Asia/Tokyo').format(fm) + "\n");
    res.end('');
})

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
app.use('/admin4', require(__dirname + '/admins/admin4'))
//////////////////////////////模組化end///////////////////////////////

///////////////////////////////mySQL  skier//////////////////////////
app.get('/try-db', (req, res) => {
    const sql = "SELECT * FROM `MGNT_VENDOR` WHERE `name` like ?";
    db.query(sql, ["%小明%"],(error, results, fields) => {
        console.log(error);
        console.log(results);
        console.log(fields);
        // res.json(results);

        for (let r of results) {
            r.create_time2 = moment(r.create_time).format('YYYY-MM-DD');
        }

        res.render('try-db', {
            rows: results
        });
    });
});
///////////////////////////////bluebird//////////////////////////////
app.get('/try-db2/:page?', (req, res) => {
   let page = req.params.page || 1;
   let perPage = 5;
   const output = {};

   db.queryAsync("SELECT count(1) total FROM `MGNT_SKI_TICKETS`")
   .then(results=>{
    //    res.json(results);
       output.total = results[0].total;
       return db.queryAsync(`SELECT * FROM MGNT_SKI_TICKETS LIMIT ${(page-1)*perPage}, ${perPage}`)
   })
   .then(results=>{
        output.rows = results;
        res.json(output);
   })
   .catch(error=>{
       console.log(error)
   })
})

///////////////////////////////9/27準備後端服務////////////////////////
app.get('/try-session2',(req, res)=>{
    req.session.views = req.session.views || 0;
    req.session.views++;

    res.json({
        views: req.session.views
    })
})

// 自訂404頁面  須放在路由設定的後面
app.use((req, res) => {
    res.type('text/plain');
    res.status(404);
    res.send('404----error---sorry')
})


// server 偵聽
app.listen(3000, () => {
    console.log('server started 3000')
})