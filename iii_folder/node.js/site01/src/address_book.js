const express = require('express');
const router = express.Router();
const bluebird = require('bluebird');
const mysql = require('mysql');
const db = mysql.createConnection({
    host: '35.201.219.20',
    user: 'skier',
    password: 'XmpP8u42',
    database: 'SKI'
})
db.connect();
bluebird.promisifyAll(db);

const perPage = 10;  // 每頁有幾筆資料
router.get('/:page?/:keyword?', (req,res) => {
    const output = {}
    output.params = req.params;
    output.perPage = perPage;
    let page = parseInt(req.params.page) || 1;

    ///////////////////////////關鍵字 start//////////////////////////
    let keyword = req.params.keyword || '';
    let where = " WHERE 1 ";
    if (keyword) {
        keyword = keyword.split("'").join("\\'");  // 避免 sql injection
        where += " AND (`ticket` LIKE '%" + keyword + "%' or `sid` LIKE '%" + keyword + "%') ";
        output.keyword = keyword
    }
    ///////////////////////////關鍵字 end//////////////////////////

    let t_sql = "SELECT count(1) total FROM `MGNT_SKI_TICKETS`"  + where;
    db.queryAsync(t_sql)
    .then(results =>{
        output.totalRows = results[0]['total'];
        output.totalPage = Math.ceil(output.totalRows/perPage);
        // 避免第0頁時繼續執行 先跳脫這個then
        if(output.totalPage==0){
            return;
        }
        if(page<1) page = 1;
        if(page>output.totalPage) page = output.totalPage;

        output.page = page
        // return db.queryAsync("SELECT * FROM `MGNT_SKI_TICKETS` LIMIT " + (page-1)*perPage + "," + perPage)
        return db.queryAsync("SELECT * FROM `MGNT_SKI_TICKETS` " + where + " LIMIT ?, ? ", [(page-1)*perPage, perPage]);
    })
    .then(results =>{
        output.rows = results
        res.json(output)
    })
    .catch(error =>{
        console.log(error)
    })

})
module.exports = router;