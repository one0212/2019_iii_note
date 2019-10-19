//目前瀏覽器使用window.indexedDB時,會在前面加上前綴詞
//所以為了相容於不同的瀏覽器,所以加上了下面的程式
if (!window.indexedDB) {
    window.indexedDB = window.mozIndexedDB || window.webkitIndexedDB;
}
var db;
window.addEventListener("load", openDB, false);

function openDB() {

    var btnAdd = document.getElementById("buttonAdd");
    btnAdd.addEventListener("click", writeItem, false);


    //使用open()建立資料庫
    //____________________________________________________________; 
    var request = window.indexedDB.open('TestDB', 1); 


    //開啟資料庫失敗後,會觸發error事件
    request.onerror = function (e) {
        alert("Open DB Error!!");
    }

    //第一次建好資料庫或是資料庫的版本改變都會觸發upgradeneeded事件
    //在此事件中我們可以建立Object Store 來存放資料
    request.onupgradeneeded = function (e) {      //請將 "_______" 換成正確的程式
        db = e.target.result; //取得IDBDatabase物件
        //判斷要建立的ObjectStore是否已經存在
        if (db.objectStoreNames.contains("emp")) {
            alert("emp 已存在");
        }
        else {
            //使用createObjectStore的方法建立ObjectStore,設定keypath為myKey                 
            var store = db.createObjectStore('emp', {
   /////////////////////////////請將 "_______" 換成正確的程式
                "keyPath": "myKey"
            })  //請將 "_______" 換成正確的程式

            //使用createIndex的方法建立name,email的key及index
            // store.createIndex("nameIndex","name",{unique:true});____________________________________________________________;    //請將 "_______" 換成正確的程式
            // store.createIndex("emailIndex","email",{unique:false});____________________________________________________________;    //請將 "_______" 換成正確的程式
        }
    };
    //開啟資料庫成功後,會觸發success事件
    request.onsuccess = function (e) {
        db = e.target.result; //取得IDBDatabase物件
        readItem();
    }
}
//將資料存入 Object Store中
function writeItem() {
    //在transaction中進行進行CRUD操作
    var trans = db.transaction(["emp"], "readwrite");//_________________________________________; 

    //使用ObjectStore方法取得emp的儲存空間
    var store = trans.objectStore("emp");//_________________________; 
    // 準備存入到emp中的資料
    var key = new Date().getTime();  //產生primary key
    var name = document.getElementById("txtName").value; // 帳號
    var email = document.getElementById("txtMail").value; // email
    //使用add的方法新增一筆資料
    // 因為沒有設置autoIncrement所以要手動key入
    var writeRequest = store.add({"myKey": key, "name": name, "email": email});//___________________________________________; //請將 "_______" 換成正確的程式
    writeRequest.onsuccess = function (e) {
        alert("write OK!!");
        readItem();
    }

}

//讀取Object Store中的資料
function readItem() {
    var trans = db.transaction(["emp"], 'readwrite');
    var store = trans.objectStore("emp");
    var show = document.getElementById("div1");
    show.innerHTML = "";
    //使用openCursor的方法讀取Object Store中的資料
    var cursorRequest = store.openCursor();//_________________________; //請將 "_______" 換成正確的程式     
    var str = "<table  class='table table-bordered'><tr><th>ID</th><th>帳號</th><th>電子郵件</th><th>刪除</th><th>修改</th></tr>";

    cursorRequest.onsuccess = function (e) {
        var result = e.target.result;
        if (!!result == false) return;
        //要讀出值需透過 result.value.您存key的名稱
        str += "<tr><td>" + result.value.myKey + "</td><td contenteditable='true'>" + result.value.name +
            "</td><td contenteditable='true'>" + result.value.email +
            "</td><td><button class='btn btn-danger' onclick=removeItem('" + result.value.myKey + "')>刪除</button></td>" +
            "<td><button class='btn btn-info' onclick=updateItem(this)>修改</button></td></tr>";

        result.continue();
        show.innerHTML = str + "</table>";
    }

}

//刪除Obejct Store中的資料
function removeItem(key) {
    var trans = db.transaction(["emp"], 'readwrite');
    var store = trans.objectStore("emp");
    //使用delete的方法進行刪除
    // 原本拿到的會是字串 轉型成數字才行
    var deleteRequest = store.delete(parseInt(key));//_________________________; //請將 "_______" 換成正確的程式  

    deleteRequest.onsuccess = function (event) {
        alert("delete OK!!");
        readItem();
    };

}

//修改Object Store中資料
function updateItem(obj) {
    var trans = db.transaction(["emp"], 'readwrite');
    var store = trans.objectStore("emp");

    //W3C DOM
    var key = parseInt(obj.parentNode.parentNode.childNodes[0].firstChild.nodeValue);
    var name = obj.parentNode.parentNode.childNodes[1].firstChild.nodeValue;
    var mail = obj.parentNode.parentNode.childNodes[2].firstChild.nodeValue;

    //使用put的方法進行修改
    var updateRequest = store.put({"myKey":key, "name": name, "email": email});//_________________________; //請將 "_______" 換成正確的程式 

    updateRequest.onsuccess = function (e) {
        alert("update OK!!");
        readItem();
    }
}