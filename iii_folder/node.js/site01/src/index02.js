// 引入express
const express = require('express');

const url = require('url');
const bodyParser = require('body-parser');

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

// app.get('/123', (req,res) =>{
//     res.send('apple');

// });

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