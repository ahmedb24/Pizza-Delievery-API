/**
 * HTTP and HTTPS Server File
 * 
 * 
 */

//Dependencies
const fs = require('fs');
const config = require('./config');
const path = require('path');
const url = require('url');
const http = require('http');
const https = require('https');
const StringDecoder = require('string_decoder').StringDecoder;
const util = require('util');
const debug = util.debuglog('server');
var helpers = require('./helpers');
const handlers = require('./handlers');
const workers = require('./workers');


//Container for app
const server = {};

//Instantiate the HTTP Server
server.httpServer = http.createServer((req, res) => {
    server.unifiedServer(req, res);
});

//Start the HTTP Server by listening on port 3000
server.startHttpServer = () => {
    server.httpServer.listen(config.httpPort, () => {
        console.log('\x1b[36m%s\x1b[0m','The HTTP server is running on port '+config.httpPort);
    });
};

//Create the options for the HTTPS Server
server.httpsServerOptions = {
    key: fs.readFileSync(path.join(__dirname, './../https/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, './../https/cert.pem'))
}

//Instantiate the HTTPS Server
server.httpsServer = https.createServer(server.httpsServerOptions, (req, res) => {
    server.unifiedServer(req, res);
});

//Start the HTTPS Server
server.startHttpsServer = () => {
    server.httpsServer.listen(config.httpsPort, () => {
        console.log('\x1b[35m%s\x1b[0m','The HTTPS server is running on port '+config.httpsPort);
    });
};

//Unified Server shared by HTTP and HTTPS
server.unifiedServer = (req, res) => {
    //Parse the url
    var parsedUrl = url.parse(req.url, true);
    
    //Get the path
    var path = parsedUrl.pathname;
    
    //Trim unwanted slashes
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');
    
    //Get the query string as an object
    var queryStringObject = parsedUrl.query;
    
    //Get the method 
    var method = req.method;

    //Get the request headers
    var headers = req.headers;
    
    //Get if any, the payload from the request in chunks and combine them into a string
    const decoder = new StringDecoder('utf-8');
    var stringBuffer = '';
    req.on('data', (data) => {
        stringBuffer += decoder.write(data);
    });
    
    req.on('end', () => {
        //Cap the buffer
        stringBuffer += decoder.end();

        //Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
       var choosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;

       //If the request is within the public directory use to the public handler instead
       choosenHandler = trimmedPath.indexOf('public/') > -1 ? handlers.public : choosenHandler;
        
        //Construct the request data/payload to be passed to choosenHandler
        var data = {
            'path': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method.toLowerCase(),
            'payload': helpers.jsonify(stringBuffer),
            'headers': headers
        }
        
        try {
            //Invoke the choosenHandler with the payload
            choosenHandler(data, (statusCode, payload, contentType) => {
                //Send handler response for processing
                server.processHandlerResponse(res, method, trimmedPath, statusCode, payload, contentType);
            });
        } catch (error) {
            //Log the error to console            
            debug(error);
            server.processHandlerResponse(res, method, trimmedPath, 500, {'Error': 'An unknown error has occured'}, 'json');
        }
    });
}

server.processHandlerResponse = (res, method, trimmedPath, statusCode, payload, contentType) => {
     //Determine the type of response (default to json)
     contentType = typeof(contentType) == 'string' ? contentType : 'json'; 

     //Determine the status code from the handler, default to 200
     statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

    //Return the response parts that are content-type specific
    var payloadString = '';
    if (contentType == 'json') {
        res.setHeader('Content-Type', 'application/json');
        payload = typeof(payload) == 'object' ? payload : {};
        payloadString = JSON.stringify(payload);
    } 

    if (contentType == 'html') {
        res.setHeader('Content-Type', 'text/html');
        payloadString = typeof(payload) == 'string' ? payload : '';
    }

    if (contentType == 'css') {
        res.setHeader('Content-Type', 'text/css');
        payloadString = typeof(payload) !== 'undefined' ? payload : '';
    }
    
    if (contentType == 'plain') {
        res.setHeader('Content-Type', 'text/plain');
        payloadString = typeof(payload) !== 'undefined' ? payload : '';
    }
    
    if (contentType == 'favicon') {
        res.setHeader('Content-Type', 'image/x-icon');
        payloadString = typeof(payload) !== 'undefined' ? payload : '';
    }
    
    if (contentType == 'png') {
        res.setHeader('Content-Type', 'image/png');
        payloadString = typeof(payload) !== 'undefined' ? payload : '';
    }

    if (contentType == 'jpg') {
        res.setHeader('Content-Type', 'jpeg');
        payloadString = typeof(payload) !== 'undefined' ? payload : '';
    }

    //Return the response-parts common to all content-types
    res.writeHead(statusCode);
    res.end(payloadString);

    //If the response is 200, print green otherwise print red
    if (statusCode == 200) {
        debug('\x1b[32m%s\x1b[0m',method.toUpperCase()+' /'+trimmedPath+' '+statusCode);
    } else {
        debug('\x1b[31m%s\x1b[0m',method.toUpperCase()+' /'+trimmedPath+' '+statusCode);
    }
}

//Define the request router
server.router = {
    //TODO unused endpoints
    '' : handlers.index,
    'user/account/create' : handlers.accountCreate,
    'user/account/edit' : handlers.accountEdit,
    'user/account/deleted' : handlers.accountDeleted,
    'user/session/create' : handlers.sessionCreate,
    'user/session/deleted' : handlers.sessionDeleted,
    'user/cart/list' : handlers.cartList,
    'user/order/create' : handlers.orderCreate,
    'menu/list' : handlers.menuList,
    'orders/create' : handlers.pizzaCreate,
    'pizza/edit' : handlers.pizzaEdit,
    'ping': handlers.ping,
    'api/users': handlers.users,
    'api/tokens': handlers.tokens,
    'api/menu': handlers.menu,
    'api/carts': handlers.carts,
    'api/orders': handlers.orders,
    'api/create-payment-intent': handlers.create_payment_intent,
    'public':handlers.public,
    'sample': handlers.test,
    'notFound': handlers.notFound
}

server.init = () => {
    //Start the HTTP server
    server.startHttpServer();
    
    //Start the HTTPS server
    server.startHttpsServer();
    
    workers.init();
}


//Export the server container
module.exports = server;