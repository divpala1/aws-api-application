const express = require('express');
const mysql = require('mysql');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware for parsing JSON body.
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.listen(PORT, () => {
    console.log(`App is running on http://localhost:${PORT}`)
})

// Connecting to the AWS RDS Database
var connection = mysql.createConnection({
    host: 'techwondoe-db.cakvucmglvhb.us-east-1.rds.amazonaws.com',
    port: 'PORT',
    user: 'admin',
    password: 'PASSWORD',
    database: 'my_db'
});

// Checking if the connection is established or not.
connection.connect(err => {
    if(err){
        console.log('Database connection failed: ' + err.stack);
        return;
    }
    console.log("Connected to RDS.");
});

app.post('/upload', (req, res) => {
    const { entries } = req.body;
    
    for (const i in entries) {
        // Query to be ran
        var sql = `INSERT INTO users (id, name, surname, dob, gender) VALUES ('${entries[i].id}', '${entries[i].name}', '${entries[i].surname}', '${entries[i].dob}', '${entries[i].gender}')`
        
        // var sql = 'DELETE FROM users where name = "A"'

        // Running the query
        connection.query(sql, function(err, result) {
            if (err) throw err;
            console.log(result);
        });

        res.send({done: `Uploaded entry ${entries[i].name} to Database.`});
    }
    
    connection.end()
})
