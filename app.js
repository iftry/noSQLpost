const express = require('express')
const app = express()
const port = 3000
const mysql = require('mysql');

app.use(
  express.urlencoded({
    extended: true,
  })
)

app.use(express.json());

const connection = mysql.createConnection ({
  host: "localhost",
  user: "root",
  password: "",
  port: "3306",
  database: "treesdb"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

//@POST
//@ "/"
app.post("/medziai", (req, res)=>{
let sql = `INSERT INTO trees (name, height, type) VALUES (?,?,?);`;

connection.query(sql, [req.body.name, req.body.height, req.body.type], (err, result)=>{
  if (err) {
    console.error("Error insert data", err);
    return res
    .status(500)
    .json({message: "Error insertind data.", error: err.message});
  }
});

res.json({message: "Data inserted succesfully"});
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})