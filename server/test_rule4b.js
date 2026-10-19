const http = require('http');
const app = require('./server');

let server;

function runTest(port) {
  const data = JSON.stringify({
    version: "1.1",
    approverId: "POL-DL-4892", // The requester of this amendment!
    vote: "APPROVE",
    comment: "Attempting self-approval"
  });

  const options = {
    hostname: 'localhost',
    port: port,
    path: '/api/documents/FIR-2024-MH-1920/quorum-vote',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  const req = http.request(options, (res) => {
    console.log(`STATUS_CODE: ${res.statusCode}`);
    let responseData = '';

    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      console.log('RESPONSE_BODY:', responseData);
      if (server) {
        server.close();
      }
      if (res.statusCode === 403) {
        console.log('SUCCESS: Self-approval is strictly blocked server-side with 403 Forbidden!');
        process.exit(0);
      } else {
        console.error('FAIL: Expected status code 403 but got', res.statusCode);
        process.exit(1);
      }
    });
  });

  req.on('error', (e) => {
    if (server) server.close();
    console.error(`Problem with request: ${e.message}`);
    process.exit(1);
  });

  req.write(data);
  req.end();
}

// Check if server is already running on port 5000, if not start in-process server
const checkReq = http.get('http://localhost:5000/api/personas', (res) => {
  res.resume();
  runTest(5000);
});

checkReq.on('error', () => {
  server = app.listen(0, () => {
    const port = server.address().port;
    runTest(port);
  });
});
