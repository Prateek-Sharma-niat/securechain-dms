const http = require('http');

const data = JSON.stringify({
  version: "1.1",
  approverId: "POL-DL-4892", // The requester of this amendment!
  vote: "APPROVE",
  comment: "Attempting self-approval"
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/documents/FIR-2024-MH-1920/quorum-vote',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
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
  console.error(`Problem with request: ${e.message}`);
  process.exit(1);
});

req.write(data);
req.end();
