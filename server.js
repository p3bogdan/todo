const mysql = require('mysql');


const pool = mysql.createPool({

    host:"localhost",
    user:"bogdan",
    password:"bogdan",
    port:3306,
    connectionLimit: 10
});

pool.query('select * from database_todo_1.user', (err,results)=>{
  
    if (err) {
        console.error('Error executing query:', err);
      } else {
        console.log(results);
        pool.end();
      }
});


