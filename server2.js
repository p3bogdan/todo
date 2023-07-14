const http = require('http');
const mysql = require('mysql');
const cors = require('cors');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'bogdan',
  password: 'bogdan',
  port: 3306,
  connectionLimit: 10,
  database: 'database_todo_1',
});

const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Enable CORS using the cors middleware
  cors()(req, res, () => {
    if (req.method === 'POST' && req.url === '/register') {
      // Handle user registration
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const { username, email, password } = JSON.parse(body);

        // Validate the input fields (e.g., check for required fields, proper email format, etc.)
        // ...

        // Insert the user data into the database
        const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        const values = [username, email, password];

        pool.query(query, values, (err, result) => {
          if (err) {
            console.error('Error during user registration:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'An error occurred during registration' }));
          } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'User registered successfully' }));
          }
        });
      });
    } else if (req.method === 'POST' && req.url === '/login') {
      // Handle user login
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const { username, password } = JSON.parse(body);

        // Validate the input fields (e.g., check for required fields, proper format, etc.)
        // ...

        // Check if the user credentials are valid
        const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
        const values = [username, password];

        pool.query(query, values, (err, result) => {
          if (err) {
            console.error('Error during user login:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'An error occurred during login' }));
          } else {
            if (result.length > 0) {
              // Login successful
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ message: 'Login successful' }));
            } else {
              // Login failed
              res.statusCode = 401;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Invalid username or password' }));
            }
          }
        });
      });
    } else {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Not Found');
    }
  });
});

// Start the server
server.listen(3000, () => {
  console.log('Server started on port 3000');
});
