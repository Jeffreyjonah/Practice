We can create streams in node to transfer data and increase performance.

A stream is a sequence of data that is being moved from one point to another over time.

The idea is to process streams of data in chunks as they arrive instead of waiting for the entire data to be available before processing.

Ex: Watching a video on Youtube 
The data arrives in chunks while therest of the data arrives over time

It helps to prevent uneccessary data downloads and memory usage

Area where people wait is nothing but a buffer


Node.js cannot control the pace at which data arrives in the stream.

It can only decide when is the right time to send the data for processing 

if there is data already processed or too little to process, Node puts the arriving data in a buffer.

It is an intentionally small area that Node maintains in the runtime to process a stream of data
