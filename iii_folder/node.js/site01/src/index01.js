const http = require('http');
const fs = require('fs');

const server = http.createServer((request, response)=>{
    fs.writeFile(
        __dirname + '/header01.json',
        JSON.stringify(request.headers),
        error =>{
            console.log('save ok')
    });

    response.writeHead(200, { 
        //writeHead(狀態碼,{物件})
        'Content-Type': 'text/html'
    });
    response.end(`<h2>Hello~~${request.url}</h2>`);
});

server.listen(3000); // port