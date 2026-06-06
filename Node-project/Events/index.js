// var eventEmitter = new events.EventEmitter();
// eventEmitter.on('eventName', eventHandler);

// eventEmitter.emit('eventName');



// const events = require('events');

// const eventEmitter = new events.EventEmitter();

// const connectHandler = function connected() {
//   console.log('connection successful.');
// }

// eventEmitter.on('connection', connectHandler);

// eventEmitter.on('data_received', function () {
//   console.log('data received successfully.')
// })

// eventEmitter.emit('connection')
// eventEmitter.emit('data_received')

// console.log('Program Ended')

const EventEmitter = require('node:events');

const emitter = new EventEmitter();

emitter.on("order-pizza", (size, topping) => {
  console.log(`Order received! Baking a ${size} pizza with ${topping}`);
});

emitter.on("order-pizza", (size) => {
  if (size === 'large') {
    console.log("Serving complimentary drink");
  }
})

console.log("Do work before event occurs in the system");
emitter.emit("order-pizza", "large", "mushroom");
