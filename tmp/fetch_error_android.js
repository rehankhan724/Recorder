const http = require('http');

const options = {
  hostname: 'localhost',
  port: 8081,
  path: '/index.bundle?platform=android&dev=true',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    // Only print first 500 chars if it's a bundle, or all if it's JSON
    if (chunk.startsWith('{')) {
        console.log(`BODY: ${chunk}`);
    } else {
        console.log(`BODY (partial): ${chunk.substring(0, 200)}`);
    }
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.end();
