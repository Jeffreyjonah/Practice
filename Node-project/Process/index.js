process.on('beforeExit', (code) => {
  console.log('A beforeExit event occured with code: ', code);
});

process.on('exit', (code) => {
  console.log('Process exit event with code', code);
});

console.log('This message is a displayed first.');
