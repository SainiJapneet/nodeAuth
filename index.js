
const http = require('http');
const app = require('./app');


const server = http.createServer(app);


server.on('Active ', () => {

    console.log('Active on port ' + ' 8080')
})

server.listen(8080)