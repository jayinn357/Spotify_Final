import http from 'http';

const data = JSON.stringify({ artistId: '3g7vYcdDXnqnDKYFwqXBJP' });

const options = {
  hostname: 'localhost',
  port: 8000,
  path: '/api/tracks/import',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('STATUS', res.statusCode);
    try {
      console.log(JSON.parse(body));
    } catch (e) {
      console.log(body);
    }
  });
});

req.on('error', (e) => {
  console.error('Request error', e.message);
});

req.write(data);
req.end();
