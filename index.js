/**
 * Entry point of the App
 * 
 * 
 */

//Dependencies
const server = require('./lib/server.js');


//Container for app
const app = {};

app.init = () => {
    server.init();
}

app.init();