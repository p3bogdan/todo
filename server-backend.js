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
      // ... Your existing registration logic ...
    } else if (req.method === 'POST' && req.url === '/login/') {
      // Handle user login
      // ... Your existing login logic ...
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
