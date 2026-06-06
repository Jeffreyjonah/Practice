Importing the module
// const events = require('events');

This creates the event board, the thing that will track which events exist and who's listening to them.
// const eventEmitter = new events.EventEmitter();

A regular function stored in a variable, it does nothing yet, it's just sitting and waiting to be called
// const connectHandler = function connected() {
// console.log('connection successful.');
// }

eventEmitter.on('connection', connectHandler);
//Whenever the connection event fires, run connect handler
//The on. method takes 2 things:
//The event name 'connection'
//The function to run when that event fires

Node looks up who's listening for 'connection', finds connectHandler, and calls it immediately.
//eventEmitter.emit('connection');
