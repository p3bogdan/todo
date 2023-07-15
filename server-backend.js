const http = require('http');
const mysql = require('mysql');
const cors = require('cors');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'generate212312jSAdlkajSA2@d',
  port: 3306,
  connectionLimit: 10,
  database: 'database_todo_1',
});

function addTaskToDatabase(task) {
  const query = 'INSERT INTO tasks (task) VALUES (?)';
  const values = [task];

  pool.query(query, values, (err, result) => {
    if (err) {
      console.error('Error adding task to database:', err);
      // Handle error response
    } else {
      console.log('Task added to database successfully');
      // Handle success response
    }
  });
}

function deleteTaskFromDatabase(task) {
  const query = 'DELETE FROM tasks WHERE task = ?';
  const values = [task];

  pool.query(query, values, (err, result) => {
    if (err) {
      console.error('Error deleting task from database:', err);
      // Handle error response
    } else {
      console.log('Task deleted from database successfully');
      // Handle success response
    }
  });
}

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
    } else if (req.method === 'POST' && req.url === '/add-task') {
      // Handle adding a new task
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const { task } = JSON.parse(body);
        if (!task) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Task is missing' }));
          return;
        }
        addTaskToDatabase(task);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Task added successfully' }));
      });
    } else if (req.method === 'GET' && req.url === '/get-tasks') {
      // Retrieve tasks from the database
      const query = 'SELECT * FROM tasks';
  
      pool.query(query, (err, result) => {
        if (err) {
          console.error('Error fetching tasks from database:', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'An error occurred while fetching tasks from the database' }));
        } else {
          const tasks = result.map(row => ({ value: row.task }));
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(tasks));
        }
      });
    } else if (req.method === 'POST' && req.url === '/delete-task') {
      // Handle deleting a task
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const { task } = JSON.parse(body);
        if (!task) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Task is missing' }));
          return;
        }
        deleteTaskFromDatabase(task);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Task deleted successfully' }));
      });
    } else {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Not Found');
    }
  });
});

server.listen(3000, () => {
  console.log('Server started on port 3000');
});