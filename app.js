/*-----------------------------------------------------------------------------
A simple "Hello World" bot that can be run from a console window.

# RUN THE BOT:

    Run the bot from the command line using "node app.js" and then type 
    "hello" to wake the bot up.

-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');

// Create bot and add dialogs
var connector = new builder.ChatConnector({
    appId: 'e3e45825-cb35-4e1d-8a7e-f2cb86ad36bf',
    appPassword: 'gdHHc1LB52qpJTtd1AmEnZi'
});

var bot = new builder.UniversalBot(connector);  

bot.dialog('/', function (session) {
    session.send('Hello World');
});

// Setup Restify Server
var server = restify.createServer();
server.post('/api/messages', connector.listen());
server.listen(process.env.port || 3978, function () {
    console.log('%s listening to %s', server.name, server.url); 
});