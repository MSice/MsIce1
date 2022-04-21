const http = require('http');
const PORT = 3000;
const request = require('request')

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
  });
  
server.listen(PORT, () => {
console.log(`Server running at PORT:http://localhost:${PORT}/`);
});
request('https://segmentfault.com/a/1190000023034660', function (
  error,
  response,
  body
) {
  console.error('error:', error)
  console.log('body:', body)
})