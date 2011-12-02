var Connect = require("connect"),
    Monomi = require("monomi");

Connect.createServer(

    Monomi.detectBrowserType(),

    function(request, response, next) {
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.write('Hello World, ');
        response.end('and thanks for using a ' + request.monomi.browserType + ' browser');
    }
    
).listen(8080);
